/**
 * Walks a node list (from src/parser.js) and produces the final string
 * output, calling registered $functions along the way.
 *
 * Two kinds of functions:
 *  - normal:  args are evaluated to strings BEFORE the function runs.
 *  - lazy:    the function receives the raw, unevaluated arg node-lists
 *             plus the ctx and the `evalNodes` helper itself, so it can
 *             decide which branches to evaluate (used by $if, $repeat, ...).
 */
async function evalNodes(nodes, ctx, functions) {
  let output = "";

  for (const node of nodes) {
    if (node.type === "text") {
      output += node.value;
      continue;
    }

    // node.type === "func"
    const fn = functions[node.name.toLowerCase()];

    if (!fn) {
      output += `[stoatly.js: unknown function $${node.name}]`;
      continue;
    }

    let result;
    try {
      if (fn.lazy) {
        result = await fn.execute(node.args, ctx, (nds) => evalNodes(nds, ctx, functions));
      } else {
        const args = [];
        for (const argNodes of node.args) {
          args.push(await evalNodes(argNodes, ctx, functions));
        }
        result = await fn.execute(args, ctx);
      }
    } catch (err) {
      result = `[stoatly.js: error in $${node.name} - ${err.message}]`;
    }

    if (result !== undefined && result !== null) {
      output += result;
    }
  }

  return output;
}

export { evalNodes };
