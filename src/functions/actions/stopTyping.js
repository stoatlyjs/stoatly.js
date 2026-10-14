export default {
  name: "stopTyping",
  execute: (_args, ctx) => {
    ctx.channel?.stopTyping();
    return "";
  },
};
