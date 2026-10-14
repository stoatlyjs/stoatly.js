export default {
  name: "subVar",
  execute: (args, ctx) => {
    const [name, amount, scope] = args;
    const value = ctx.client.db.add(name, -(Number(amount) || 0), scope || ctx.defaultScope);
    return String(value);
  },
};
