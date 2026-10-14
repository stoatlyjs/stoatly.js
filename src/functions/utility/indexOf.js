export default {
  name: "indexOf",
  execute: (args) => {
    const [text, search] = args;
    return String(String(text ?? "").indexOf(String(search ?? "")));
  },
};
