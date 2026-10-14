export default {
  name: "length",
  execute: (args) => String(String(args[0] ?? "").length),
};
