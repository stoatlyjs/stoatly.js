// Shared internal helper - not a $function itself.
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
