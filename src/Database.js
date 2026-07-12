import fs from "node:fs";
import path from "node:path";

/**
 * Minimal persistent key/value store for $setVar / $getVar / $addVar / $subVar.
 * Not meant to replace a real database for large bots - swap it out by
 * passing a custom `database` object with get/set/delete/has methods to
 * StoatlyClient if you need something more serious (SQLite, Postgres, etc).
 */
class Database {
  constructor(options = {}) {
    this.filePath = options.path || path.join(process.cwd(), "stoatly.db.json");
    this.data = {};
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        this.data = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      }
    } catch {
      this.data = {};
    }
  }

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      // Non-fatal: keep running in-memory even if disk write fails.
      console.error("stoatly.js: failed to persist database:", err.message);
    }
  }

  _key(scope, name) {
    return `${scope}::${name}`;
  }

  get(name, scope = "global", fallback = undefined) {
    const key = this._key(scope, name);
    return key in this.data ? this.data[key] : fallback;
  }

  set(name, value, scope = "global") {
    this.data[this._key(scope, name)] = value;
    this._save();
    return value;
  }

  has(name, scope = "global") {
    return this._key(scope, name) in this.data;
  }

  delete(name, scope = "global") {
    delete this.data[this._key(scope, name)];
    this._save();
  }

  add(name, amount, scope = "global") {
    const current = Number(this.get(name, scope, 0)) || 0;
    const updated = current + Number(amount);
    this.set(name, updated, scope);
    return updated;
  }
}

export { Database };

