import { sleep } from "./_sleep.js";

export default {
  name: "wait",
  execute: async (args) => {
    const [ms] = args;
    await sleep(Number(ms) || 0);
    return "";
  },
};
