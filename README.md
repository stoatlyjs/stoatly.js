# stoatly.js

[![npm version](https://img.shields.io/npm/v/stoatly.js.svg?style=flat-square)](https://www.npmjs.com/package/stoatly.js)
[![CI](https://github.com/stoatlyjs/stoatly.js/actions/workflows/ci.yml/badge.svg)](https://github.com/stoatlyjs/stoatly.js/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/website?style=flat-square&url=https://stoatly.js.org&label=stoatly.js.org)](https://stoatly.js.org)

A **string-based command framework** for [Stoat](https://stoat.chat)
(the open-source chat platform formerly known as Revolt).

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

client.login("TOKEN");
```

## Requirements

- Node.js **v22.15.0** or later, since `stoat.js` itself requires it (Deno v2.2+ also works).
- `stoatly.js` is an **ES module** (`"type": "module"`). Use `import`, not `require()`. If your project is CommonJS, either switch it to `"type": "module"` in your own `package.json`, or load it with a dynamic `import("stoatly.js")`.

## Install

```bash
npm install stoatly.js
```

That's it - `stoat.js` ships as a dependency of `stoatly.js` (currently pinned to `^7.3.6`). You don't need to `npm install stoat.js` yourself.

If you ever need to use `stoat.js` directly alongside stoatly.js (e.g. to reach a newer feature stoatly.js doesn't wrap yet), `client.client` gives you the raw `stoat.js` `Client` instance. see "Escaping to raw stoat.js" below.

## Built-in functions

**Context / reading**
| Function | Description |
|---|---|
| `$message[index?]` | Full message content, or a specific word by index |
| `$args[index?]` | All args joined, or one arg by index |
| `$argsCount` | Number of args passed to the command |
| `$mention[index?]` | Formats a mentioned user's ID as `<@id>` |
| `$mentionsCount` | Number of users mentioned in the message |
| `$authorID` | ID of the message author |
| `$username` | Username of the message author |
| `$isBot` | `"true"`/`"false"` - whether the message author is a bot |
| `$channelID` / `$channelName` | Current channel's ID / display name |
| `$serverID` / `$serverName` | Current server's ID / name |
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
| `$startTyping` / `$stopTyping` | Shows/hides the typing indicator in the current channel |

**Logic**
| Function | Description |
|---|---|
| `$if[condition;then;else?]` | Branches; supports `==`,`!=`,`>`,`<`,`>=`,`<=`,`&&`,`\|\|` |
| `$not[condition]` | Negates a condition string - `"true"`/`"false"` |
| `$switch[value;case1;result1;case2;result2;...;default?]` | Matches `value` against each `case` in order; only the matching branch (or `default`) is evaluated |
| `$onlyIf[condition;errorMessage?]` | Stops the whole command if the condition is false, optionally sending `errorMessage` first |
| `$stop[message?]` | Unconditionally stops the rest of the command, optionally sending `message` first |
| `$try[code;fallback?]` | Runs `code`; if it throws or triggers `$stop`/`$onlyIf`, runs `fallback` instead **without** halting the outer command |
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

**Utility - general**
| Function | Description |
|---|---|
| `$math[expression]` | Safe arithmetic: `+ - * / % ^ ()` |
| `$random[min;max]` | Random integer, inclusive |
| `$randomText[a;b;c;...]` | Picks one argument at random |
| `$comment[anything]` | Evaluates to nothing (for notes in your code) |
| `$newline` | Inserts `\n` |

**Utility - strings**
| Function | Description |
|---|---|
| `$length[text]` | Character count |
| `$substring[text;start;end?]` | Slice of `text` |
| `$replace[text;search;replacement]` | Replaces every occurrence of `search` |
| `$split[text;separator;index?]` | Splits `text`; returns one part by index, or all parts comma-joined |
| `$trim[text]` | Removes leading/trailing whitespace |
| `$indexOf[text;search]` | Position of `search` in `text`, or `-1` |
| `$includes[text;search]` | `"true"`/`"false"` |
| `$capitalize[text]` | Uppercases the first character |
| `$upperCase[text]` / `$lowerCase[text]` | Case conversion |
| `$padStart[text;length;padChar?]` / `$padEnd[...]` | Pads to a fixed length |
| `$repeatText[text;count]` | Repeats `text` `count` times (max 1000) |

**Utility - numbers & dates**
| Function | Description |
|---|---|
| `$round[number;decimals?]` | Rounds to `decimals` places (default 0) |
| `$floor[number]` / `$ceil[number]` / `$abs[number]` | Standard math rounding/absolute value |
| `$timestamp` | Current time as unix milliseconds |
| `$formatDate[ms?]` | ISO 8601 string for `ms`, or the current time if omitted |

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

You can still listen to raw events directly if you need something stoatly.js
doesn't cover yet:

```js
client.on("messageCreate", (message) => {
  // full access to the underlying stoat.js Message object
});
```

`client.client` is the underlying `stoat.js` `Client` instance if you need
lower-level access. Its objects (users, channels, messages, etc.) are
reactive under the hood - if you're building a UI on top of a bot (e.g. a
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
