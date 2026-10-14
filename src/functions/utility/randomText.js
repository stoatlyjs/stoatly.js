export default {
  name: "randomText",
  execute: (args) => {
    if (args.length === 0) return "";
    return args[Math.floor(Math.random() * args.length)];
  },
};
