export function benchmarkFunction(func: (...args: unknown[]) => unknown): unknown {
  const start = Date.now();
  const result = func();
  const end = Date.now();
  console.log(`Function ${func.name} took ${end - start} milliseconds`);
  return result;
}
