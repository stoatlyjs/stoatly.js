export default {
  name: "loopIndex",
  execute: (_args, ctx) => String(ctx.loopIndex ?? ""),
};
