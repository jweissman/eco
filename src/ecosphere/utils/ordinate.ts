export default function ordinate(num: number){
  // var num = this + 1,
  let last = num.toString().slice(-1),
      ord = '';
  switch (last) {
      case '1':
          ord = 'st';
          break;
      case '2':
          ord = 'nd';
          break;
      case '3':
          ord = 'rd';
          break;
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
          ord = 'th';
          break;
  }
  return num.toString() + ord;
};
