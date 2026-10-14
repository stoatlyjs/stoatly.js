export default {
  name: "channelName",
  execute: (_args, ctx) => ctx.channel?.name ?? "",
};
