export default {
  name: "replace",
  execute: (args) => {
    const [text, search, replacement] = args;
    return String(text ?? "").split(String(search ?? "")).join(replacement ?? "");
  },
};
