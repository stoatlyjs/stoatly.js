export default {
  name: "padEnd",
  execute: (args) => {
    const [text, length, padChar] = args;
    return String(text ?? "").padEnd(Number(length) || 0, padChar ?? " ");
  },
};
