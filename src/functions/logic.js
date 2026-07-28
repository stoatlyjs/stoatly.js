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

  not: {
    name: "not",
    execute: (args) => String(!evaluateCondition(args[0] ?? "")),
  },

  switch: {
    name: "switch",
    lazy: true,
    execute: async (rawArgs, ctx, evalNodes) => {
      // $switch[value;case1;result1;case2;result2;...;default?]
      // Only the value and the matching case/result pair (or the trailing
      // default) get evaluated - other branches are skipped entirely, same
      // as $if.
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
  },

  stop: {
    name: "stop",
    lazy: true,
    execute: async (rawArgs, ctx, evalNodes) => {
      // $stop[message?] - unconditionally halts the rest of the command,
      // optionally sending `message` first. Like $onlyIf but with no
      // condition to check.
      const message = rawArgs[0] ? await evalNodes(rawArgs[0], ctx) : null;
      const err = new Error("stop");
      err.isStop = true;
      err.userMessage = message;
      throw err;
    },
  },

  try: {
    name: "try",
    lazy: true,
    execute: async (rawArgs, ctx, evalNodes) => {
      // $try[code;fallback?] - runs `code`; if it throws (including a
      // $stop/$onlyIf signal raised inside it), the throw is contained
      // here and `fallback` runs instead. Does NOT halt the outer command,
      // even for $stop/$onlyIf - that's the point of catching it.
      try {
        return await evalNodes(rawArgs[0] ?? [], ctx);
      } catch {
        return rawArgs[1] ? evalNodes(rawArgs[1], ctx) : "";
      }
    },
  },
};
