export default {
  name: "reply",
  execute: async (args, ctx) => {
    const [content] = args;
    const sent = await ctx.message.reply(content ?? "");
    if (sent) ctx.lastSentMessage = sent;
    return "";
  },
};
