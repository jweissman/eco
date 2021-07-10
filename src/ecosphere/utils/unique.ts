export function unique(arr: any[]) {
  var u = {}, a = [];
  for (var i = 0, l = arr.length; i < l; ++i) {
    if (!u.hasOwnProperty(arr[i])) {
      a.push(arr[i]);
      // @ts-ignore
      u[arr[i]] = 1;
    }
  }
  return a;
}
