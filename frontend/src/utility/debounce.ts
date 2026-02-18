export const debounce = (func: Function, delay: number) => {
  let timeout: number | null = null;

  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(args);
    }, delay);
  };
};
