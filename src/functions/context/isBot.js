export default {
  name: "isBot",
  execute: (_args, ctx) => String(Boolean(ctx.message.author?.bot)),
};
