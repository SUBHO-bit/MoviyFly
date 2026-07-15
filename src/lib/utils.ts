/**
 * Simple and robust class merger for Tailwind CSS.
 * Combines classes, filters out falsy values, and handles conditional classes.
 */
export function cn(...inputs: any[]): string {
  const classes: string[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const arg = inputs[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = cn(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.filter(Boolean).join(' ');
}
