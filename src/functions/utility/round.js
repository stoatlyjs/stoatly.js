export default {
  name: "round",
  execute: (args) => {
    const [num, decimals] = args;
    const factor = 10 ** (Number(decimals) || 0);
    return String(Math.round(Number(num) * factor) / factor);
  },
};
