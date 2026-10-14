import { evaluateCondition } from "../../expressions.js";

export default {
  name: "onlyIf",
  lazy: true,
  execute: async (rawArgs, ctx, evalNodes) => {
    // $onlyIf[condition;errorMessage?] - stops command execution if false
    const conditionStr = await evalNodes(rawArgs[0] ?? [], ctx);
    if (!evaluateCondition(conditionStr)) {
      const errorMsg = rawArgs[1] ? await evalNodes(rawArgs[1], ctx) : null;
      const err = new Error("onlyIf condition failed");
      err.isStop = true;
      err.userMessage = errorMsg;
      throw err;
    }
    return "";
  },
};
