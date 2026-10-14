export default {
  name: "repeatText",
  execute: (args) => {
    const [text, count] = args;
    const n = Math.max(0, Math.min(1000, Number(count) || 0));
    return String(text ?? "").repeat(n);
  },
};
