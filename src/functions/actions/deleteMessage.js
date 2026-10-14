import { sleep } from "./_sleep.js";

export default {
  name: "deleteMessage",
  execute: async (args, ctx) => {
    const [delayMs] = args;
    const target = ctx.lastSentMessage ?? ctx.message;
    if (delayMs) await sleep(Number(delayMs));
    await target.delete();
    return "";
  },
};
