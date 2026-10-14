export default {
  name: "random",
  execute: (args) => {
    const min = Number(args[0]) || 0;
    const max = Number(args[1]) || 0;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  },
};
