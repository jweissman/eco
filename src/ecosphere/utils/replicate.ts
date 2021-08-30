export function construct(fn: () => any, times: number, flatten?: boolean) {
  // Create an array of size "n" with undefined values
  var arrays: Array<any> = Array.apply(null, new Array(times)); 

  // Replace each "undefined" with our array, resulting in an array of n copies of our array
  arrays = arrays.map(fn) //() => fn()) //() => array) //function() { return array });

  // Flatten our array of arrays
  if (flatten) {
  return [].concat.apply([], arrays);
  } else {
    return arrays;
  }

}

export function replicate(array: Array<any>, times: number) {
  return construct(() => array, times)
  // Create an array of size "n" with undefined values
  // var arrays: Array<any> = Array.apply(null, new Array(times)); 

  // // Replace each "undefined" with our array, resulting in an array of n copies of our array
  // arrays = arrays.map(() => array) //function() { return array });

  // Flatten our array of arrays
  // return [].concat.apply([], arrays);
}
