/**
 * stoatly.js parser
 * -----------------
 * Turns a command's "code" string (e.g. "Hello $mention, $ping ms")
 * into a tree of nodes:
 *   { type: "text", value: "..." }
 *   { type: "func", name: "sendMessage", args: [ [nodes...], [nodes...] ] }
 *
 * Function syntax: $functionName[arg1;arg2;arg3]
 * - Arguments are separated by ";" at the current bracket depth.
 * - Arguments themselves may contain nested $functions[...].
 * - A function with no brackets (e.g. "$ping") is parsed as a zero-arg call.
 * - To use a literal "$" followed by letters without triggering parsing,
 *   escape it as "$$" (e.g. "$$name" prints "$name" literally).
 */

const NAME_RE = /[A-Za-z_][A-Za-z0-9_]*/y;

function parseSequence(str, i, terminators) {
  const nodes = [];
  let buffer = "";
  let literalBracketDepth = 0; // tracks stray "[" ... "]" pairs that are just text

  const flush = () => {
    if (buffer.length > 0) {
      nodes.push({ type: "text", value: buffer });
      buffer = "";
    }
  };

  while (i < str.length) {
    const ch = str[i];

    if (ch === "]" && literalBracketDepth > 0 && terminators.includes("]")) {
      literalBracketDepth--;
      buffer += ch;
      i++;
      continue;
    }

    if (terminators.includes(ch)) break;

    // A "[" that isn't opening a $function's argument list is just literal
    // text - track its depth so a matching "]" doesn't prematurely close
    // the enclosing function call.
    if (ch === "[" && terminators.includes("]")) {
      literalBracketDepth++;
      buffer += ch;
      i++;
      continue;
    }

    // Escaped dollar sign: "$$" -> literal "$"
    if (ch === "$" && str[i + 1] === "$") {
      buffer += "$";
      i += 2;
      continue;
    }

    if (ch === "$") {
      NAME_RE.lastIndex = i + 1;
      const match = NAME_RE.exec(str);
      if (match && match.index === i + 1) {
        const name = match[0];
        let j = i + 1 + name.length;

        if (str[j] === "[") {
          flush();
          j++; // skip "["
          const args = [];
          for (;;) {
            const [argNodes, newIndex] = parseSequence(str, j, [";", "]"]);
            args.push(argNodes);
            j = newIndex;
            if (str[j] === ";") {
              j++;
              continue;
            }
            if (str[j] === "]") {
              j++;
              break;
            }
            // Reached end of string without a closing bracket.
            break;
          }
          nodes.push({ type: "func", name, args });
          i = j;
          continue;
        }

        // Bare function reference with no argument list, e.g. $ping
        flush();
        nodes.push({ type: "func", name, args: [] });
        i = j;
        continue;
      }
    }

    buffer += ch;
    i++;
  }

  flush();
  return [nodes, i];
}

/**
 * Parses a full command code string into a node tree.
 * @param {string} code
 * @returns {Array<object>} node list
 */
function parse(code) {
  if (typeof code !== "string") {
    throw new TypeError("stoatly.js: command code must be a string");
  }
  const [nodes] = parseSequence(code, 0, []);
  return nodes;
}

export { parse, parseSequence };
