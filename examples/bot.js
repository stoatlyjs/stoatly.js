// Run with: node examples/bot.js
// Requires STOAT_BOT_TOKEN to be set in your environment.

import { StoatlyClient } from "../index.js";

const client = new StoatlyClient({
  prefix: "!",
  database: { path: "./stoatly.db.json" },
});

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
  name: "roll",
  code: "You rolled a $random[1;6]!",
});

client.command({
  name: "score",
  code: `$if[$args[0]==add;
    $addVar[score;1;$authorID]Nice, you're now at $getVar[score;0;$authorID] points!;
    Your current score is $getVar[score;0;$authorID]. Try "!score add" to gain a point.
  ]`,
});

client.command({
  name: "hello",
  code: "Hi there, $mention! I'm a stoatly.js bot running on Stoat.",
});

// You can still register a custom function if the built-ins aren't enough:
client.addFunction({
  name: "shout",
  execute: (args) => String(args[0] ?? "").toUpperCase() + "!!!",
});

client.command({
  name: "shout",
  code: "$shout[$args]",
});

client.login(process.env.STOAT_BOT_TOKEN).catch((err) => {
  console.error("Failed to log in:", err);
  process.exit(1);
});
