export default {
  name: "ping",
  execute: (_args, ctx) => String(ctx.client.ping ?? 0),
};
