import { Client } from "stoat.js";
import { parse } from "./parser.js";
import { evalNodes } from "./Interpreter.js";
import { Database } from "./Database.js";
import builtinFunctions from "./functions/index.js";

class StoatlyClient {
  /**
   * @param {object} options
   * @param {string} [options.token] - bot token, can also be passed to login()
   * @param {string} [options.prefix="!"] - command prefix
   * @param {boolean} [options.mentionPrefix=true] - allow @bot as a prefix too
   * @param {object} [options.database] - { path } forwarded to the built-in Database
   */
  constructor(options = {}) {
    this.options = { prefix: "!", mentionPrefix: true, ...options };
    this.commands = new Map();
    this.aliases = new Map();
    this.functions = { ...builtinFunctions };
    this.db = new Database(options.database || {});
    this.ping = 0;

    this.client = new Client();
    this._bindCoreEvents();
  }

  /**
   * Registers a command.
   * @param {object} def
   * @param {string} def.name
   * @param {string[]} [def.aliases]
   * @param {string} def.code - the stoatly.js function-string code to run
   */
  command(def) {
    if (!def || !def.name || typeof def.code !== "string") {
      throw new TypeError("stoatly.js: command() requires { name, code }");
    }
    const compiled = { ...def, ast: parse(def.code) };
    this.commands.set(def.name.toLowerCase(), compiled);
    for (const alias of def.aliases || []) {
      this.aliases.set(alias.toLowerCase(), def.name.toLowerCase());
    }
    return this;
  }

  /**
   * Registers a custom $function, e.g.
   *   client.addFunction({ name: "double", execute: (args) => String(Number(args[0]) * 2) });
   */
  addFunction(fn) {
    if (!fn || !fn.name || typeof fn.execute !== "function") {
      throw new TypeError("stoatly.js: addFunction() requires { name, execute }");
    }
    this.functions[fn.name.toLowerCase()] = fn;
    return this;
  }

  /** Thin passthrough so users can still listen to raw stoat.js events if needed. */
  on(event, listener) {
    this.client.on(event, listener);
    return this;
  }

  async login(token) {
    const t = token || this.options.token;
    if (!t) throw new Error("stoatly.js: no bot token provided to login()");
    await this.client.loginBot(t);
    return this;
  }

  _bindCoreEvents() {
    this.client.on("ready", () => {
      this.user = this.client.user;
      console.log(`stoatly.js: logged in as ${this.user?.username ?? "unknown"}`);
    });

    this.client.on("messageCreate", (message) => {
      this._handleMessage(message).catch((err) => {
        console.error("stoatly.js: unhandled error while running command:", err);
      });
    });
  }

  async _handleMessage(message) {
    if (!message || typeof message.content !== "string") return;
    if (message.author?.bot) return; // ignore other bots (message.author.bot is `{ owner }` or undefined)

    const prefixes = [this.options.prefix];
    if (this.options.mentionPrefix && this.user?.id) {
      prefixes.push(`<@${this.user.id}>`);
    }

    const usedPrefix = prefixes.find((p) => message.content.startsWith(p));
    if (!usedPrefix) return;

    const withoutPrefix = message.content.slice(usedPrefix.length).trim();
    const [rawName, ...args] = withoutPrefix.split(/\s+/).filter(Boolean);
    if (!rawName) return;

    const name = rawName.toLowerCase();
    const commandName = this.commands.has(name) ? name : this.aliases.get(name);
    const command = commandName ? this.commands.get(commandName) : null;
    if (!command) return;

    // Message, Channel, and Server all expose direct getters for each other
    // in stoat.js, so no manual id-based lookup is needed here.
    const channel = message.channel;
    const server = message.server;
    const mentions = message.mentionIds ?? [];

    const ctx = {
      client: this,
      message,
      channel,
      server,
      args,
      mentions,
      prefix: usedPrefix,
      defaultScope: server?.id ?? "global",
      resolveChannel: (id) => this.resolveChannel(id),
      resolveUser: (id) => this.resolveUser(id),
      lastSentMessage: null,
    };

    try {
      await evalNodes(command.ast, ctx, this.functions);
    } catch (err) {
      if (err.isStop) {
        if (err.userMessage) await channel?.sendMessage(err.userMessage);
        return;
      }
      throw err;
    }
  }

  async resolveChannel(id) {
    if (!id) return null;
    return this.client.channels.get(id) ?? (await this.client.channels.fetch(id).catch(() => null));
  }

  async resolveUser(id) {
    if (!id) return null;
    return this.client.users.get(id) ?? (await this.client.users.fetch(id).catch(() => null));
  }
}

export { StoatlyClient };
