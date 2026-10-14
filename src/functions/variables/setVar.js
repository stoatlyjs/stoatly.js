export default {
  name: "setVar",
  execute: (args, ctx) => {
    const [name, value, scope] = args;
    ctx.client.db.set(name, value, scope || ctx.defaultScope);
    return "";
  },
};
