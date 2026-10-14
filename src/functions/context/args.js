export default {
  name: "args",
  execute: (args, ctx) => {
    if (args[0] === undefined || args[0] === "") return ctx.args.join(" ");
    return ctx.args[Number(args[0])] ?? "";
  },
};
