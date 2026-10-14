export default {
  name: "getVar",
  execute: (args, ctx) => {
    const [name, fallback, scope] = args;
    const value = ctx.client.db.get(name, scope || ctx.defaultScope, fallback ?? "");
    return String(value);
  },
};
