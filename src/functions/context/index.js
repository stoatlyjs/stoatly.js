import message from "./message.js";
import args from "./args.js";
import argsCount from "./argsCount.js";
import mention from "./mention.js";
import mentionsCount from "./mentionsCount.js";
import authorID from "./authorID.js";
import username from "./username.js";
import isBot from "./isBot.js";
import channelID from "./channelID.js";
import channelName from "./channelName.js";
import serverID from "./serverID.js";
import serverName from "./serverName.js";
import prefix from "./prefix.js";
import ping from "./ping.js";

const list = [
  message,
  args,
  argsCount,
  mention,
  mentionsCount,
  authorID,
  username,
  isBot,
  channelID,
  channelName,
  serverID,
  serverName,
  prefix,
  ping,
];

export default Object.fromEntries(list.map((fn) => [fn.name.toLowerCase(), fn]));
