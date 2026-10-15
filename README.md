<div align="center">
	<br />
	<p>
		<a href="https://stoatly.js.org/"><img src="https://stoatly.js.org/assets/logo.png" width="546" alt="stoatly.js" /></a>
	</p>
</div>
---
<br>
<div align="center">
  
[![npm version](https://img.shields.io/npm/v/stoatly.js.svg?style=flat-square)](https://www.npmjs.com/package/stoatly.js)&nbsp;&nbsp;
[![CI](https://github.com/stoatlyjs/stoatly.js/actions/workflows/ci.yml/badge.svg)](https://github.com/stoatlyjs/stoatly.js/actions/workflows/ci.yml)&nbsp;&nbsp;

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)&nbsp;&nbsp;
[![Website](https://img.shields.io/website?style=flat-square&url=https://stoatly.js.org&label=stoatly.js.org)](https://stoatly.js.org)&nbsp;&nbsp;

</div>

## About 

A **string-based command framework** for [Stoat](https://stoat.chat)
(the open-source chat platform formerly known as Revolt), built on top of the
official [`stoat.js`](https://github.com/stoatchat/javascript-client-sdk) client.

## Install

```bash
npm install stoatly.js
```

That's it `stoat.js` ships as a dependency of `stoatly.js` (currently pinned to `^7.3.6`). You don't need to `npm install stoat.js` yourself.

If you ever need to use `stoat.js` directly alongside stoatly.js (e.g. to reach a newer feature stoatly.js doesn't wrap yet), `client.client` gives you the raw `stoat.js` `Client` instance see "Escaping to raw stoat.js" below.


## Setup

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

## Development

```bash
npm install
npm test    # runs the test suite (node:test)
npm run lint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a new `$function`.