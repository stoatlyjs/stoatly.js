export default {
  name: "mentionsCount",
  execute: (_args, ctx) => String(ctx.mentions?.length ?? 0),
};
