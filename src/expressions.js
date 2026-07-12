/**
 * A small, dependency-free, safe arithmetic evaluator.
 * Supports: + - * / % ^ ( ) unary minus, decimals.
 * Deliberately does NOT use eval()/Function() so command code
 * can never execute arbitrary JS.
 */
function evaluateMath(input) {
  const tokens = tokenize(String(input));
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
  function next() {
    return tokens[pos++];
  }

  function parseExpr() {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = next();
      const rhs = parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm() {
    let value = parsePow();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = next();
      const rhs = parsePow();
      if (op === "*") value *= rhs;
      else if (op === "/") value /= rhs;
      else value %= rhs;
    }
    return value;
  }

  function parsePow() {
    let value = parseUnary();
    if (peek() === "^") {
      next();
      const rhs = parsePow(); // right-associative
      value = Math.pow(value, rhs);
    }
    return value;
  }

  function parseUnary() {
    if (peek() === "-") {
      next();
      return -parseUnary();
    }
    if (peek() === "+") {
      next();
      return parseUnary();
    }
    return parseAtom();
  }

  function parseAtom() {
    const tok = next();
    if (tok === "(") {
      const value = parseExpr();
      if (peek() === ")") next();
      return value;
    }
    const num = Number(tok);
    if (Number.isNaN(num)) {
      throw new Error(`stoatly.js: invalid token in $math expression: "${tok}"`);
    }
    return num;
  }

  const result = parseExpr();
  return result;
}

function tokenize(input) {
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if ("+-*/%^()".includes(ch)) {
      tokens.push(ch);
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      tokens.push(input.slice(i, j));
      i = j;
      continue;
    }
    throw new Error(`stoatly.js: unexpected character in $math expression: "${ch}"`);
  }
  return tokens;
}

/**
 * Evaluates a simple condition string used by $if / $onlyIf, e.g.:
 *   "5>3", "$args[0]==ping", "a!=b", "1<=1 && 2>1"
 * Supports ==, !=, >=, <=, >, < and top-level && / || (left to right, no
 * parentheses grouping - keep conditions simple).
 */
function evaluateCondition(input) {
  const str = String(input).trim();

  if (str.includes("&&")) {
    return str.split("&&").every((part) => evaluateCondition(part));
  }
  if (str.includes("||")) {
    return str.split("||").some((part) => evaluateCondition(part));
  }

  const operators = ["==", "!=", ">=", "<=", ">", "<"];
  for (const op of operators) {
    const idx = str.indexOf(op);
    if (idx === -1) continue;
    const left = str.slice(0, idx).trim();
    const right = str.slice(idx + op.length).trim();
    return compare(left, right, op);
  }

  // No operator: truthy check (non-empty, not "false"/"0")
  return str.length > 0 && str !== "false" && str !== "0";
}

function compare(left, right, op) {
  const leftNum = Number(left);
  const rightNum = Number(right);
  const bothNumeric = !Number.isNaN(leftNum) && !Number.isNaN(rightNum) && left !== "" && right !== "";
  const a = bothNumeric ? leftNum : left;
  const b = bothNumeric ? rightNum : right;

  switch (op) {
    case "==":
      return a === b;
    case "!=":
      return a !== b;
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    default:
      return false;
  }
}

export { evaluateMath, evaluateCondition };
