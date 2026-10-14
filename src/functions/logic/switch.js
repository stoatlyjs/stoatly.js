export default {
  name: "switch",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $switch[value;case1;result1;case2;result2;...;default?]
    if (rawArgs.length === 0) return "";
    const value = await evalNodes(rawArgs[0] ?? [], ctx);

    const hasDefault = (rawArgs.length - 1) % 2 === 1;
    const pairsEnd = hasDefault ? rawArgs.length - 1 : rawArgs.length;

    for (let i = 1; i < pairsEnd; i += 2) {
      const caseValue = await evalNodes(rawArgs[i] ?? [], ctx);
      if (caseValue === value) {
        return evalNodes(rawArgs[i + 1] ?? [], ctx);
      }
    }

    return hasDefault ? evalNodes(rawArgs[rawArgs.length - 1] ?? [], ctx) : "";
  },
};
