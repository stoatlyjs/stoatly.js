import { evaluateCondition } from "../expressions.js";

export default {
  if: {
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
  },

  onlyif: {
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
  },

  repeat: {
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
  },

  loopindex: {
    name: "loopIndex",
    execute: (_args, ctx) => String(ctx.loopIndex ?? ""),
  },
};
