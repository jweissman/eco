export function randomInteger(min: number, max: number) {
  // return min + Math.floor(Math.random() * (max - min));
  let result = Math.floor(Math.random() * (max - min + 1) + min)
  // console.log("Random integer between " + min + " and " + max + ": " + result)
  return result
}
