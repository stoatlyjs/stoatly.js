import sendMessage from "./sendMessage.js";
import reply from "./reply.js";
import deleteMessage from "./deleteMessage.js";
import editMessage from "./editMessage.js";
import addReaction from "./addReaction.js";
import dm from "./dm.js";
import wait from "./wait.js";
import startTyping from "./startTyping.js";
import stopTyping from "./stopTyping.js";

const list = [
  sendMessage,
  reply,
  deleteMessage,
  editMessage,
  addReaction,
  dm,
  wait,
  startTyping,
  stopTyping,
];

export default Object.fromEntries(list.map((fn) => [fn.name.toLowerCase(), fn]));
