export default {
  name: "lowerCase",
  execute: (args) => String(args[0] ?? "").toLowerCase(),
};
