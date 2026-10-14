export default {
  name: "stop",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $stop[message?] - unconditionally halts the rest of the command.
    const message = rawArgs[0] ? await evalNodes(rawArgs[0], ctx) : null;
    const err = new Error("stop");
    err.isStop = true;
    err.userMessage = message;
    throw err;
  },
};
