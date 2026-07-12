function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  sendmessage: {
    name: "sendMessage",
    execute: async (args, ctx) => {
      const [content, channelId] = args;
      const channel = channelId ? await ctx.resolveChannel(channelId) : ctx.channel;
      if (!channel) return "[stoatly.js: $sendMessage - channel not found]";
      const sent = await channel.sendMessage(content ?? "");
      ctx.lastSentMessage = sent;
      return "";
    },
  },

  reply: {
    name: "reply",
    execute: async (args, ctx) => {
      const [content] = args;
      const sent = await ctx.message.reply(content ?? "");
      if (sent) ctx.lastSentMessage = sent;
      return "";
    },
  },

  deletemessage: {
    name: "deleteMessage",
    execute: async (args, ctx) => {
      const [delayMs] = args;
      const target = ctx.lastSentMessage ?? ctx.message;
      if (delayMs) await sleep(Number(delayMs));
      await target.delete();
      return "";
    },
  },

  editmessage: {
    name: "editMessage",
    execute: async (args, ctx) => {
      const [content] = args;
      const target = ctx.lastSentMessage;
      if (target) await target.edit({ content: content ?? "" });
      return "";
    },
  },

  addreaction: {
    name: "addReaction",
    execute: async (args, ctx) => {
      const [emoji] = args;
      const target = ctx.lastSentMessage ?? ctx.message;
      await target.react(emoji);
      return "";
    },
  },

  dm: {
    name: "dm",
    execute: async (args, ctx) => {
      const [userId, content] = args;
      const user = await ctx.resolveUser(userId);
      if (!user) return "[stoatly.js: $dm - user not found]";
      const dmChannel = await user.openDM();
      await dmChannel.sendMessage(content ?? "");
      return "";
    },
  },

  wait: {
    name: "wait",
    execute: async (args) => {
      const [ms] = args;
      await sleep(Number(ms) || 0);
      return "";
    },
  },
};
