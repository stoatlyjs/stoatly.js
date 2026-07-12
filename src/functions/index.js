import context from "./context.js";
import actions from "./actions.js";
import logic from "./logic.js";
import variables from "./variables.js";
import utility from "./utility.js";

const registry = {
  ...context,
  ...actions,
  ...logic,
  ...variables,
  ...utility,
};

export default registry;

