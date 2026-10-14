export default {
  name: "try",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $try[code;fallback?] - catches throws (including $stop/$onlyIf)
    // raised inside `code` and runs `fallback` instead, without halting
    // the outer command.
    try {
      return await evalNodes(rawArgs[0] ?? [], ctx);
    } catch {
      return rawArgs[1] ? evalNodes(rawArgs[1], ctx) : "";
    }
  },
};
