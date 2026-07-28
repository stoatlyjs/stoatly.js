import test from "node:test";
import assert from "node:assert/strict";

import { parse } from "../src/parser.js";
import { evalNodes } from "../src/Interpreter.js";
import functions from "../src/functions/index.js";
import { evaluateMath, evaluateCondition } from "../src/expressions.js";

test("parses and evaluates plain text with function calls", async () => {
  const ast = parse("Hello $mention, $ping ms");
  const out = await evalNodes(
    ast,
    { client: { ping: 42 }, mentions: ["01ABCXYZ"] },
    functions
  );
  assert.equal(out, "Hello <@01ABCXYZ>, 42 ms");
});

test("$if only evaluates the taken branch", async () => {
  const ast = parse("$if[$args[0]==ping;Pong!;Unknown command: $args[0]]");
  assert.equal(await evalNodes(ast, { args: ["ping"] }, functions), "Pong!");
  assert.equal(
    await evalNodes(ast, { args: ["foo"] }, functions),
    "Unknown command: foo"
  );
});

test("$repeat loops and exposes $loopIndex", async () => {
  const ast = parse("$repeat[3;[$loopIndex]]");
  const out = await evalNodes(ast, {}, functions);
  assert.equal(out, "[0][1][2]");
});

test("$$ escapes a literal dollar sign", async () => {
  const ast = parse("$$notafunction");
  const out = await evalNodes(ast, {}, functions);
  assert.equal(out, "$notafunction");
});

test("unknown functions produce a visible error marker instead of crashing", async () => {
  const ast = parse("$totallyMadeUp[1]");
  const out = await evalNodes(ast, {}, functions);
  assert.match(out, /unknown function \$totallyMadeUp/);
});

test("$setVar / $getVar round-trip through a fake db", async () => {
  const fakeDb = {
    store: {},
    set(name, value) {
      this.store[name] = value;
    },
    get(name, _scope, fallback) {
      return name in this.store ? this.store[name] : fallback;
    },
  };
  const ast = parse("$setVar[score;10]Score is $getVar[score]");
  const out = await evalNodes(
    ast,
    { client: { db: fakeDb }, defaultScope: "global" },
    functions
  );
  assert.equal(out, "Score is 10");
});

test("evaluateMath handles precedence and parentheses", () => {
  assert.equal(evaluateMath("2 + 3 * (4 - 1) ^ 2"), 29);
  assert.equal(evaluateMath("10 / 2 - 1"), 4);
});

test("evaluateMath rejects invalid input instead of executing code", () => {
  assert.throws(() => evaluateMath("process.exit()"));
});

test("evaluateCondition supports comparisons and && / ||", () => {
  assert.equal(evaluateCondition("5>3"), true);
  assert.equal(evaluateCondition("5>3 && 2==2"), true);
  assert.equal(evaluateCondition("5>3 && 2==3"), false);
  assert.equal(evaluateCondition("1==2 || 3==3"), true);
  assert.equal(evaluateCondition("ping==ping"), true);
  assert.equal(evaluateCondition("ping==pong"), false);
});

test("literal square brackets in text do not break argument parsing", async () => {
  const ast = parse("$randomText[[tag] hello]");
  const out = await evalNodes(ast, {}, functions);
  assert.equal(out, "[tag] hello");
});

test("context functions read .id (not ._id), matching stoat.js's real Message/Channel/Server/User shape", async () => {
  const ctx = {
    message: {
      content: "!hello",
      author: { id: "01AUTHOR", username: "tester" },
      authorId: "01AUTHOR",
    },
    channel: { id: "01CHANNEL" },
    server: { id: "01SERVER" },
  };
  const ast = parse("$authorID / $channelID / $serverID / $username");
  const out = await evalNodes(ast, ctx, functions);
  assert.equal(out, "01AUTHOR / 01CHANNEL / 01SERVER / tester");
});

// String functions

test("string functions: length, substring, replace, split, trim, indexOf, includes, capitalize, pad, repeatText", async () => {
  const cases = [
    ["$length[hello]", "5"],
    ["$substring[hello world;0;5]", "hello"],
    ["$replace[a-b-c;-;+]", "a+b+c"],
    ["$split[a,b,c;,;1]", "b"],
    ["$trim[  hi  ]", "hi"],
    ["$indexOf[hello;ll]", "2"],
    ["$includes[hello;ell]", "true"],
    ["$includes[hello;xyz]", "false"],
    ["$capitalize[hello]", "Hello"],
    ["$padStart[7;3;0]", "007"],
    ["$padEnd[ab;5;.]", "ab..."],
    ["$repeatText[ab;3]", "ababab"],
  ];
  for (const [code, expected] of cases) {
    const out = await evalNodes(parse(code), {}, functions);
    assert.equal(out, expected, `for ${code}`);
  }
});

// Numeric / date functions

test("numeric functions: round, floor, ceil, abs", async () => {
  const cases = [
    ["$round[3.14159;2]", "3.14"],
    ["$floor[3.9]", "3"],
    ["$ceil[3.1]", "4"],
    ["$abs[-5]", "5"],
  ];
  for (const [code, expected] of cases) {
    const out = await evalNodes(parse(code), {}, functions);
    assert.equal(out, expected, `for ${code}`);
  }
});

test("$timestamp returns a plausible current unix ms value", async () => {
  const before = Date.now();
  const out = await evalNodes(parse("$timestamp"), {}, functions);
  const after = Date.now();
  const value = Number(out);
  assert.ok(value >= before && value <= after);
});

// Logic: $switch, $not, $stop, $try

test("$switch only evaluates the matching branch (and default when nothing matches)", async () => {
  const code = "$switch[$args[0];ping;Pong!;pong;Ping!;Unknown: $args[0]]";
  const ast = parse(code);
  assert.equal(await evalNodes(ast, { args: ["ping"] }, functions), "Pong!");
  assert.equal(await evalNodes(ast, { args: ["pong"] }, functions), "Ping!");
  assert.equal(await evalNodes(ast, { args: ["foo"] }, functions), "Unknown: foo");
});

test("$not negates a condition string", async () => {
  assert.equal(await evalNodes(parse("$not[5>3]"), {}, functions), "false");
  assert.equal(await evalNodes(parse("$not[5<3]"), {}, functions), "true");
});

test("$onlyIf actually halts the rest of the command instead of just printing an error", async () => {
  // Regression test: evalNodes used to swallow $onlyIf's stop signal into
  // inline error text and kept executing subsequent nodes. It must now
  // propagate and stop the whole command's remaining output.
  const ast = parse("$onlyIf[$argsCount>0;Missing argument!]This should never run.");
  const err = await evalNodes(ast, { args: [] }, functions).catch((e) => e);
  assert.ok(err instanceof Error);
  assert.equal(err.isStop, true);
  assert.equal(err.userMessage, "Missing argument!");
});

test("$onlyIf lets the command continue normally when its condition passes", async () => {
  const ast = parse("$onlyIf[$argsCount>0]Got: $args[0]");
  const out = await evalNodes(ast, { args: ["hi"] }, functions);
  assert.equal(out, "Got: hi");
});

test("$stop unconditionally halts the command with an optional message", async () => {
  const ast = parse("Before $stop[Stopped here]After (never runs)");
  const err = await evalNodes(ast, {}, functions).catch((e) => e);
  assert.ok(err instanceof Error);
  assert.equal(err.isStop, true);
  assert.equal(err.userMessage, "Stopped here");
});

test("$try catches a $stop signal raised inside it and runs the fallback, without halting the outer command", async () => {
  const ast = parse("$try[$stop[boom];fallback ran]After try");
  const out = await evalNodes(ast, {}, functions);
  assert.equal(out, "fallback ranAfter try");
});

test("$try returns the code's output directly when nothing throws", async () => {
  const ast = parse("$try[all good;fallback]");
  const out = await evalNodes(ast, {}, functions);
  assert.equal(out, "all good");
});

// New context functions

test("$channelName, $serverName, $mentionsCount, $isBot", async () => {
  const ctx = {
    message: { content: "hi", author: { bot: { owner: "01OWNER" } } },
    channel: { name: "general" },
    server: { name: "My Server" },
    mentions: ["01A", "01B"],
  };
  const ast = parse("$channelName / $serverName / $mentionsCount / $isBot");
  const out = await evalNodes(ast, ctx, functions);
  assert.equal(out, "general / My Server / 2 / true");
});
