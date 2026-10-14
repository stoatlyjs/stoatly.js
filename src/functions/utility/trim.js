export default {
  name: "trim",
  execute: (args) => String(args[0] ?? "").trim(),
};
