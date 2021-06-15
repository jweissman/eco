export function where(key: string, value: any) {
  return (it: any) => it[key] === value;
}
