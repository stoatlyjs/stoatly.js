export default {
  name: "startTyping",
  execute: (_args, ctx) => {
    ctx.channel?.startTyping();
    return "";
  },
};
