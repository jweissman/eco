
export function first<T>(arr: T[], pred: (x: T) => boolean): T {
  return arr.filter(pred)[0];
}
