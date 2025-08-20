export function getDebouncedFunction<T extends (...args: any[]) => void>(
  func: T,
  wait = 300
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}
