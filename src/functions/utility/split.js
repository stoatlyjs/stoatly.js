export default {
  name: "split",
  execute: (args) => {
    const [text, separator, index] = args;
    const parts = String(text ?? "").split(separator ?? " ");
    if (index === undefined || index === "") return parts.join(",");
    return parts[Number(index)] ?? "";
  },
};
