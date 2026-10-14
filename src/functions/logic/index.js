import ifFn from "./if.js";
import onlyIf from "./onlyIf.js";
import repeat from "./repeat.js";
import loopIndex from "./loopIndex.js";
import not from "./not.js";
import switchFn from "./switch.js";
import stop from "./stop.js";
import tryFn from "./try.js";

const list = [ifFn, onlyIf, repeat, loopIndex, not, switchFn, stop, tryFn];

export default Object.fromEntries(list.map((fn) => [fn.name.toLowerCase(), fn]));
