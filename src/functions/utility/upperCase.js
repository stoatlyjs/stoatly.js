export default {
  name: "upperCase",
  execute: (args) => String(args[0] ?? "").toUpperCase(),
};
