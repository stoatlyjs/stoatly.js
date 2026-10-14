export default {
  name: "serverID",
  execute: (_args, ctx) => ctx.server?.id ?? "",
};
