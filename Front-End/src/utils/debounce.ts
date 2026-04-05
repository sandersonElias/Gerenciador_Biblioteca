// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, wait);
  };
}
