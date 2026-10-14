export default {
  name: "includes",
  execute: (args) => {
    const [text, search] = args;
    return String(String(text ?? "").includes(String(search ?? "")));
  },
};
