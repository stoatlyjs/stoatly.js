import math from "./math.js";
import random from "./random.js";
import randomText from "./randomText.js";
import upperCase from "./upperCase.js";
import lowerCase from "./lowerCase.js";
import comment from "./comment.js";
import newline from "./newline.js";
import length from "./length.js";
import substring from "./substring.js";
import replace from "./replace.js";
import split from "./split.js";
import trim from "./trim.js";
import indexOf from "./indexOf.js";
import includes from "./includes.js";
import capitalize from "./capitalize.js";
import padStart from "./padStart.js";
import padEnd from "./padEnd.js";
import repeatText from "./repeatText.js";
import round from "./round.js";
import floor from "./floor.js";
import ceil from "./ceil.js";
import abs from "./abs.js";
import timestamp from "./timestamp.js";
import formatDate from "./formatDate.js";

const list = [
  math,
  random,
  randomText,
  upperCase,
  lowerCase,
  comment,
  newline,
  length,
  substring,
  replace,
  split,
  trim,
  indexOf,
  includes,
  capitalize,
  padStart,
  padEnd,
  repeatText,
  round,
  floor,
  ceil,
  abs,
  timestamp,
  formatDate,
];

export default Object.fromEntries(list.map((fn) => [fn.name.toLowerCase(), fn]));
