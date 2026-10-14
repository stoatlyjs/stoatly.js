import { evaluateCondition } from "../../expressions.js";

export default {
  name: "if",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $if[condition;thenCode;elseCode?]
    const conditionStr = await evalNodes(rawArgs[0] ?? [], ctx);
    const isTrue = evaluateCondition(conditionStr);
    const branch = isTrue ? rawArgs[1] : rawArgs[2];
    if (!branch) return "";
    return evalNodes(branch, ctx);
  },
};
