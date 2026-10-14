export default {
  name: "mention",
  execute: (args, ctx) => {
    const idx = args[0] !== undefined && args[0] !== "" ? Number(args[0]) : 0;
    const id = ctx.mentions[idx];
    return id ? `<@${id}>` : "";
  },
};
