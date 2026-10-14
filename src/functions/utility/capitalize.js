export default {
  name: "capitalize",
  execute: (args) => {
    const s = String(args[0] ?? "");
    return s.length ? s[0].toUpperCase() + s.slice(1) : s;
  },
};
