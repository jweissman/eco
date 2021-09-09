export const distance = (a: [number, number], b: [number, number]) => {
  let dx = Math.abs(a[0] - b[0]);
  let dy = Math.abs(a[1] - b[1]);
  return Math.sqrt(dx * dx + dy * dy)
}
