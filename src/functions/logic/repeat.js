export default {
  name: "repeat",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $repeat[count;code]
    const countStr = await evalNodes(rawArgs[0] ?? [], ctx);
    const count = Math.max(0, Math.min(1000, Number(countStr) || 0));
    let out = "";
    for (let i = 0; i < count; i++) {
      ctx.loopIndex = i;
      out += await evalNodes(rawArgs[1] ?? [], ctx);
    }
    delete ctx.loopIndex;
    return out;
  },
};
