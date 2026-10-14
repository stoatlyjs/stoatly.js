export default {
  name: "deleteVar",
  execute: (args, ctx) => {
    const [name, scope] = args;
    ctx.client.db.delete(name, scope || ctx.defaultScope);
    return "";
  },
};
