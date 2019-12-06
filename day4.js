const start = 123257;
const end = 647015;

let hasDouble = (num) => {
    let result = false;
    let digits = (''+num).split('');
    for(let i = 0; i < digits.length - 1; i++){
        if(digits[i] === digits[i+1]){
            result = true;
        }
    }

    return result;
};

let getNext = (num) => {
    let digits = (''+(num+1)).split('');
    let fill = -1;
    for(let i = 0; i< digits.length; i++){
        if(fill !== -1) {
            digits[i] = fill;
        } else if(digits[i + 1] < digits[i]){
            fill = digits[i];
        }
    }

    return parseInt(digits.join(''));
};

let generateNums = (start, end) => {
    let results = [];
    let current = getNext(start);

    while (current < end){
        results.push(current);
        current = getNext(current);
    }

    return results;
};
console.log("Day 4 Part 1:")
console.log(generateNums(start, end).filter(c => hasDouble(c)).length);

let hasOneDouble = (num) => {
  let result = false;

  let digitFrequency = {};

  let digits = (''+num).split('');
  for(let i = 0; i < digits.length - 1; i++){
    if(digits[i] === digits[i+1]){
        if(digitFrequency[digits[i]] === undefined){
            digitFrequency[digits[i]] = 2;
        } else {
            digitFrequency[digits[i]]++;
        }
    }
  }
  for(let digit in digitFrequency){
      if(digitFrequency[digit] === 2){
          result = true;
      }
  }

  return result;
};

console.log("Day 4 Part 2:");
console.log(generateNums(start, end).filter(c => hasOneDouble(c)).length);
