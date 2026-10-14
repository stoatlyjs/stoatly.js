export default {
  name: "padStart",
  execute: (args) => {
    const [text, length, padChar] = args;
    return String(text ?? "").padStart(Number(length) || 0, padChar ?? " ");
  },
};
