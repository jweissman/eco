
export const capitalize = (word: string) => word.replace(/^\w/, c => c.toUpperCase()) 
export const titleize = (str: string) => str.split(' ').map(word => capitalize(word)).join(' ');
