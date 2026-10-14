export default {
  name: "authorID",
  execute: (_args, ctx) => ctx.message.author?.id ?? ctx.message.authorId ?? "",
};
