import setVar from "./setVar.js";
import getVar from "./getVar.js";
import addVar from "./addVar.js";
import subVar from "./subVar.js";
import deleteVar from "./deleteVar.js";
import hasVar from "./hasVar.js";

const list = [setVar, getVar, addVar, subVar, deleteVar, hasVar];

export default Object.fromEntries(list.map((fn) => [fn.name.toLowerCase(), fn]));
