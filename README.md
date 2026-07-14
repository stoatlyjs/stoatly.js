# stoatly.js

[![npm version](https://img.shields.io/npm/v/stoatly.js.svg)](https://www.npmjs.com/package/stoatly.js)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A **string-based command framework** for [Stoat](https://stoat.chat)
(the open-source chat platform formerly known as Revolt), built on top of the
official [`stoat.js`](https://github.com/stoatchat/javascript-client-sdk) client.

Instead of writing raw event handlers, you write commands as strings containing
`$functions`:

```js
import { StoatlyClient } from "stoatly.js";

const client = new StoatlyClient({ prefix: "!" });

client.command({
  name: "ping",
  code: "Pong! $ping ms",
});

client.command({
  name: "say",
  aliases: ["echo"],
  code: "$onlyIf[$argsCount>0;You need to give me something to say!]$sendMessage[$args]",
});

client.command({
  name: "score",
  code: `
    $if[$args[0]==add;
      $addVar[score;1;$authorID]You're now at $getVar[score;0;$authorID] points!;
      Your score is $getVar[score;0;$authorID]
    ]
  `,
});

client.login("YOUR_BOT_TOKEN");
```

## Requirements

- Node.js **v22.15.0** or later, since `stoat.js` itself requires it (Deno v2.2+ also works).
- `stoatly.js` is an **ES module** (`"type": "module"`). Use `import`, not `require()`. If your project is CommonJS, either switch it to `"type": "module"` in your own `package.json`, or load stoatly.js with a dynamic `import("stoatly.js")`.

## Install

```bash
npm install stoatly.js
```

That's it — `stoat.js` ships as a dependency of `stoatly.js` (currently pinned to `^7.3.6`). You don't need to `npm install stoat.js` yourself.

If you ever need to use `stoat.js` directly alongside stoatly.js (e.g. to reach a newer feature stoatly.js doesn't wrap yet), `client.client` gives you the raw `stoat.js` `Client` instance — see "Escaping to raw stoat.js" below.

## How the DSL works

- `$functionName[arg1;arg2;...]` calls a function with semicolon-separated arguments.
- `$functionName` with no brackets calls it with zero arguments (e.g. `$ping`).
- Arguments can contain other `$functions`, nested freely.
- `$$` produces a literal `$`.
- Plain `[` / `]` in text are fine — the parser tracks bracket depth so they
  don't get confused with argument lists, but semicolons `;` are always
  treated as argument separators, even in plain text, so avoid stray `;`
  inside a function's arguments (use `$getVar`-style separate args instead).

Some functions are **lazy** (`$if`, `$onlyIf`, `$repeat`) — they get their
raw, unevaluated arguments so they can choose which branch to run instead of
evaluating everything up front. This is how `$if` avoids running the "else"
branch's side effects (like sending a message) when the condition is true.

## Built-in functions

**Context / reading**
| Function | Description |
|---|---|
| `$message[index?]` | Full message content, or a specific word by index |
| `$args[index?]` | All args joined, or one arg by index |
| `$argsCount` | Number of args passed to the command |
| `$mention[index?]` | Formats a mentioned user's ID as `<@id>` |
| `$authorID` | ID of the message author |
| `$username` | Username of the message author |
| `$channelID` | Current channel ID |
| `$serverID` | Current server ID |
| `$prefix` | The prefix that triggered this command |
| `$ping` | Client latency in ms |

**Actions**
| Function | Description |
|---|---|
| `$sendMessage[content;channelID?]` | Sends a message |
| `$reply[content]` | Replies to the triggering message |
| `$deleteMessage[delayMs?]` | Deletes the last sent (or triggering) message |
| `$editMessage[content]` | Edits the last message sent via `$sendMessage` |
| `$addReaction[emoji]` | Reacts to the last sent (or triggering) message |
| `$dm[userID;content]` | Sends a direct message to a user |
| `$wait[ms]` | Pauses execution |

**Logic**
| Function | Description |
|---|---|
| `$if[condition;then;else?]` | Branches; supports `==`,`!=`,`>`,`<`,`>=`,`<=`,`&&`,`\|\|` |
| `$onlyIf[condition;errorMessage?]` | Stops the command if the condition is false |
| `$repeat[count;code]` | Runs `code` up to `count` times (max 1000) |
| `$loopIndex` | Current index inside `$repeat` (0-based) |

**Variables** (persisted to a JSON file by default; swap in your own `database`)
| Function | Description |
|---|---|
| `$setVar[name;value;scope?]` | Stores a value (`scope` defaults to the server ID) |
| `$getVar[name;fallback?;scope?]` | Reads a value |
| `$addVar[name;amount;scope?]` / `$subVar[...]` | Increments/decrements a numeric value |
| `$deleteVar[name;scope?]` | Deletes a value |
| `$hasVar[name;scope?]` | `"true"`/`"false"` |

**Utility**
| Function | Description |
|---|---|
| `$math[expression]` | Safe arithmetic: `+ - * / % ^ ()` |
| `$random[min;max]` | Random integer, inclusive |
| `$randomText[a;b;c;...]` | Picks one argument at random |
| `$upperCase[text]` / `$lowerCase[text]` | Case conversion |
| `$comment[anything]` | Evaluates to nothing (for notes in your code) |
| `$newline` | Inserts `\n` |

## Custom functions

```js
client.addFunction({
  name: "double",
  execute: (args) => String(Number(args[0]) * 2),
});
```

For functions that need to control evaluation of their own arguments (like
`$if`), set `lazy: true` and read `execute(rawArgNodes, ctx, evalNodes)`.

## Escaping to raw stoat.js

You can still listen to raw events directly if you need something the DSL
doesn't cover yet:

```js
client.on("messageCreate", (message) => {
  // full access to the underlying stoat.js Message object
});
```

`client.client` is the underlying `stoat.js` `Client` instance if you need
lower-level access. Its objects (users, channels, messages, etc.) are
reactive under the hood — if you're building a UI on top of a bot (e.g. a
Solid.js dashboard), you can read straight from `client.client` and it'll
stay in sync. `stoat.js` also re-exports the raw Stoat API types under
`API` (`import { API } from "stoat.js"`) for anything not yet wrapped by
either library.

## Project layout

```
stoatly.js/
  index.js                 - public exports
  src/
    StoatlyClient.js          - the client, command registry, event wiring
    parser.js                - turns "code" strings into an AST
    Interpreter.js           - walks the AST, calls functions
    expressions.js           - safe $math / $if condition evaluators
    Database.js               - simple JSON-file variable store
    functions/
      context.js              - $message, $mention, $authorID, ...
      actions.js               - $sendMessage, $reply, $wait, ...
      logic.js                  - $if, $onlyIf, $repeat
      variables.js               - $setVar, $getVar, ...
      utility.js                  - $math, $random, ...
```

## Development

```bash
npm install
npm test    # runs the test suite (node:test)
npm run lint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a new `$function`.

## License

MIT
