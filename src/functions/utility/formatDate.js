export default {
  name: "formatDate",
  execute: (args) => {
    const [ms] = args;
    const date = ms !== undefined && ms !== "" ? new Date(Number(ms)) : new Date();
    return date.toISOString();
  },
};
