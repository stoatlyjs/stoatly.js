import { evaluateMath } from "../expressions.js";

export default {
  math: {
    name: "math",
    execute: (args) => {
      const expr = args.join("");
      try {
        return String(evaluateMath(expr));
      } catch (err) {
        return `[stoatly.js: $math error - ${err.message}]`;
      }
    },
  },

  random: {
    name: "random",
    execute: (args) => {
      const min = Number(args[0]) || 0;
      const max = Number(args[1]) || 0;
      return String(Math.floor(Math.random() * (max - min + 1)) + min);
    },
  },

  randomtext: {
    name: "randomText",
    execute: (args) => {
      if (args.length === 0) return "";
      return args[Math.floor(Math.random() * args.length)];
    },
  },

  uppercase: {
    name: "upperCase",
    execute: (args) => String(args[0] ?? "").toUpperCase(),
  },

  lowercase: {
    name: "lowerCase",
    execute: (args) => String(args[0] ?? "").toLowerCase(),
  },

  comment: {
    name: "comment",
    execute: () => "",
  },

  newline: {
    name: "newline",
    execute: () => "\n",
  },
};
