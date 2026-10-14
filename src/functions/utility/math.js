import { evaluateMath } from "../../expressions.js";

export default {
  name: "math",
  execute: (args) => {
    const expr = args.join("");
    try {
      return String(evaluateMath(expr));
    } catch (err) {
      return `[stoatly.js: $math error - ${err.message}]`;
    }
  },
};
