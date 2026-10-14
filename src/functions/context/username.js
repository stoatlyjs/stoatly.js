export default {
  name: "username",
  execute: (_args, ctx) => ctx.message.author?.username ?? "",
};
