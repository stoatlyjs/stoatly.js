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
