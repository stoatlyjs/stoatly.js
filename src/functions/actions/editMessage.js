export default {
  name: "editMessage",
  execute: async (args, ctx) => {
    const [content] = args;
    const target = ctx.lastSentMessage;
    if (target) await target.edit({ content: content ?? "" });
    return "";
  },
};
