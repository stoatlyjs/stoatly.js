export default {
  name: "dm",
  execute: async (args, ctx) => {
    const [userId, content] = args;
    const user = await ctx.resolveUser(userId);
    if (!user) return "[stoatly.js: $dm - user not found]";
    const dmChannel = await user.openDM();
    await dmChannel.sendMessage(content ?? "");
    return "";
  },
};
