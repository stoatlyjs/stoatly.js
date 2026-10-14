export default {
  name: "sendMessage",
  execute: async (args, ctx) => {
    const [content, channelId] = args;
    const channel = channelId ? await ctx.resolveChannel(channelId) : ctx.channel;
    if (!channel) return "[stoatly.js: $sendMessage - channel not found]";
    const sent = await channel.sendMessage(content ?? "");
    ctx.lastSentMessage = sent;
    return "";
  },
};
