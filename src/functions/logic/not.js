import { evaluateCondition } from "../../expressions.js";

export default {
  name: "not",
  execute: (args) => String(!evaluateCondition(args[0] ?? "")),
};
