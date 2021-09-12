export const any = <T>(list: Array<T>, pred: (value: T) => boolean) => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) {
      return true
    }
  }
  return false
}

export const all = <T>(list: Array<T>, pred: (value: T) => boolean) => {
  for (let i = 0; i < list.length; i++) {
    if (!pred(list[i])) {
      return false
    }
  }
  return true
}
