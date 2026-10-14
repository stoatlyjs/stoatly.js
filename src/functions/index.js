import context from "./context/index.js";
import actions from "./actions/index.js";
import logic from "./logic/index.js";
import variables from "./variables/index.js";
import utility from "./utility/index.js";

const registry = {
  ...context,
  ...actions,
  ...logic,
  ...variables,
  ...utility,
};

export default registry;
