export function splitArray<T>(
  array: T[],
  predicate: Parameters<Array<T>["filter"]>[0]
): [passed: T[], failed: T[]] {
  return array.reduce(
    (acc, curr, index) => {
      if (predicate(curr, index, array)) {
        acc[0].push(curr);
      } else {
        acc[1].push(curr);
      }

      return acc;
    },
    [[], []] as [T[], T[]]
  );
}
