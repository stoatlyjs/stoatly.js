export default {
  setvar: {
    name: "setVar",
    execute: (args, ctx) => {
      const [name, value, scope] = args;
      ctx.client.db.set(name, value, scope || ctx.defaultScope);
      return "";
    },
  },

  getvar: {
    name: "getVar",
    execute: (args, ctx) => {
      const [name, fallback, scope] = args;
      const value = ctx.client.db.get(name, scope || ctx.defaultScope, fallback ?? "");
      return String(value);
    },
  },

  addvar: {
    name: "addVar",
    execute: (args, ctx) => {
      const [name, amount, scope] = args;
      const value = ctx.client.db.add(name, Number(amount) || 0, scope || ctx.defaultScope);
      return String(value);
    },
  },

  subvar: {
    name: "subVar",
    execute: (args, ctx) => {
      const [name, amount, scope] = args;
      const value = ctx.client.db.add(name, -(Number(amount) || 0), scope || ctx.defaultScope);
      return String(value);
    },
  },

  deletevar: {
    name: "deleteVar",
    execute: (args, ctx) => {
      const [name, scope] = args;
      ctx.client.db.delete(name, scope || ctx.defaultScope);
      return "";
    },
  },

  hasvar: {
    name: "hasVar",
    execute: (args, ctx) => {
      const [name, scope] = args;
      return String(ctx.client.db.has(name, scope || ctx.defaultScope));
    },
  },
};
