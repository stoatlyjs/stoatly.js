export default {
  message: {
    name: "message",
    execute: (args, ctx) => {
      if (args[0] !== undefined && args[0] !== "") {
        return ctx.args[Number(args[0])] ?? "";
      }
      return ctx.message.content ?? "";
    },
  },

  args: {
    name: "args",
    execute: (args, ctx) => {
      if (args[0] === undefined || args[0] === "") return ctx.args.join(" ");
      return ctx.args[Number(args[0])] ?? "";
    },
  },

  argscount: {
    name: "argsCount",
    execute: (_args, ctx) => String(ctx.args.length),
  },

  mention: {
    name: "mention",
    execute: (args, ctx) => {
      const idx = args[0] !== undefined && args[0] !== "" ? Number(args[0]) : 0;
      const id = ctx.mentions[idx];
      return id ? `<@${id}>` : "";
    },
  },

  authorid: {
    name: "authorID",
    execute: (_args, ctx) => ctx.message.author?.id ?? ctx.message.authorId ?? "",
  },

  username: {
    name: "username",
    execute: (_args, ctx) => ctx.message.author?.username ?? "",
  },

  channelid: {
    name: "channelID",
    execute: (_args, ctx) => ctx.channel?.id ?? ctx.message.channelId ?? "",
  },

  serverid: {
    name: "serverID",
    execute: (_args, ctx) => ctx.server?.id ?? "",
  },

  prefix: {
    name: "prefix",
    execute: (_args, ctx) => ctx.prefix ?? "",
  },

  ping: {
    name: "ping",
    execute: (_args, ctx) => String(ctx.client.ping ?? 0),
  },
};
