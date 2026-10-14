export default {
  name: "message",
  execute: (args, ctx) => {
    if (args[0] !== undefined && args[0] !== "") {
      return ctx.args[Number(args[0])] ?? "";
    }
    return ctx.message.content ?? "";
  },
};
