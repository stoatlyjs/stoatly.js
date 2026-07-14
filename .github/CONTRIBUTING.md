# Contributing to stoatly.js

Thanks for considering a contribution! This project is intentionally small,
so the bar for contributing is low.

## Setup

```bash
git clone https://github.com/stoatlyjs/stoatly.js.git
cd stoatly.js
npm install
npm test
```

There are no build steps — it's plain ES modules (`import`/`export`). Requires Node.js v22.15.0+, since that's what `stoat.js` itself requires.

## Adding a built-in `$function`

1. Pick the right file under `src/functions/` (`context.js` for
   read-only message data, `actions.js` for anything that talks to Stoat,
   `logic.js` for control flow, `variables.js` for storage, `utility.js`
   for everything else).
2. Export an object: `{ name: "yourFunction", execute: (args, ctx) => ... }`.
   If your function needs to control whether/how its arguments get
   evaluated (like `$if`), add `lazy: true` and use the
   `(rawArgNodes, ctx, evalNodes) => ...` signature instead.
3. Add a row to the function table in `README.md`.
4. Add a test in `test/core.test.js`.

## Running tests

```bash
npm test      # runs the test suite (node:test, no extra deps)
npm run lint  # syntax-checks every source file
```

## Pull requests

- Keep PRs focused on one thing.
- Add or update tests for any behavior change.
- Update `README.md` if you add or change a `$function`.

## Reporting bugs

Open an issue with:
- The command `code` string that misbehaved
- What you expected vs. what happened
- Your `stoatly.js` and `stoat.js` versions (`npm ls @stoatlyjs/stoatly.js stoat.js`)
