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

  // String functions

  length: {
    name: "length",
    execute: (args) => String(String(args[0] ?? "").length),
  },

  substring: {
    name: "substring",
    execute: (args) => {
      const [text, start, end] = args;
      const s = String(text ?? "");
      const startIdx = Number(start) || 0;
      const endIdx = end !== undefined && end !== "" ? Number(end) : s.length;
      return s.substring(startIdx, endIdx);
    },
  },

  replace: {
    name: "replace",
    execute: (args) => {
      const [text, search, replacement] = args;
      // Replaces all occurrences (split/join avoids regex special-char issues).
      return String(text ?? "").split(String(search ?? "")).join(replacement ?? "");
    },
  },

  split: {
    name: "split",
    execute: (args) => {
      const [text, separator, index] = args;
      const parts = String(text ?? "").split(separator ?? " ");
      if (index === undefined || index === "") return parts.join(",");
      return parts[Number(index)] ?? "";
    },
  },

  trim: {
    name: "trim",
    execute: (args) => String(args[0] ?? "").trim(),
  },

  indexof: {
    name: "indexOf",
    execute: (args) => {
      const [text, search] = args;
      return String(String(text ?? "").indexOf(String(search ?? "")));
    },
  },

  includes: {
    name: "includes",
    execute: (args) => {
      const [text, search] = args;
      return String(String(text ?? "").includes(String(search ?? "")));
    },
  },

  capitalize: {
    name: "capitalize",
    execute: (args) => {
      const s = String(args[0] ?? "");
      return s.length ? s[0].toUpperCase() + s.slice(1) : s;
    },
  },

  padstart: {
    name: "padStart",
    execute: (args) => {
      const [text, length, padChar] = args;
      return String(text ?? "").padStart(Number(length) || 0, padChar ?? " ");
    },
  },

  padend: {
    name: "padEnd",
    execute: (args) => {
      const [text, length, padChar] = args;
      return String(text ?? "").padEnd(Number(length) || 0, padChar ?? " ");
    },
  },

  repeattext: {
    name: "repeatText",
    execute: (args) => {
      const [text, count] = args;
      const n = Math.max(0, Math.min(1000, Number(count) || 0));
      return String(text ?? "").repeat(n);
    },
  },

  // Numeric functions

  round: {
    name: "round",
    execute: (args) => {
      const [num, decimals] = args;
      const factor = 10 ** (Number(decimals) || 0);
      return String(Math.round(Number(num) * factor) / factor);
    },
  },

  floor: {
    name: "floor",
    execute: (args) => String(Math.floor(Number(args[0]))),
  },

  ceil: {
    name: "ceil",
    execute: (args) => String(Math.ceil(Number(args[0]))),
  },

  abs: {
    name: "abs",
    execute: (args) => String(Math.abs(Number(args[0]))),
  },

  // Date/time functions

  timestamp: {
    name: "timestamp",
    execute: () => String(Date.now()),
  },

  formatdate: {
    name: "formatDate",
    execute: (args) => {
      const [ms] = args;
      const date = ms !== undefined && ms !== "" ? new Date(Number(ms)) : new Date();
      return date.toISOString();
    },
  },
};
