export default {
  name: "hasVar",
  execute: (args, ctx) => {
    const [name, scope] = args;
    return String(ctx.client.db.has(name, scope || ctx.defaultScope));
  },
};
