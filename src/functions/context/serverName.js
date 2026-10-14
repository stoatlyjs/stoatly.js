export default {
  name: "serverName",
  execute: (_args, ctx) => ctx.server?.name ?? "",
};
