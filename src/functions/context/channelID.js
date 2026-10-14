export default {
  name: "channelID",
  execute: (_args, ctx) => ctx.channel?.id ?? ctx.message.channelId ?? "",
};
