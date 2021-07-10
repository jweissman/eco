export function randomInteger(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}
