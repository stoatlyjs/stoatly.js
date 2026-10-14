export default {
  name: "addReaction",
  execute: async (args, ctx) => {
    const [emoji] = args;
    const target = ctx.lastSentMessage ?? ctx.message;
    await target.react(emoji);
    return "";
  },
};
