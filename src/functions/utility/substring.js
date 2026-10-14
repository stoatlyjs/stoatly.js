export default {
  name: "substring",
  execute: (args) => {
    const [text, start, end] = args;
    const s = String(text ?? "");
    const startIdx = Number(start) || 0;
    const endIdx = end !== undefined && end !== "" ? Number(end) : s.length;
    return s.substring(startIdx, endIdx);
  },
};
