const fs = require('fs')
const inputs = fs.readFileSync('inputs/day2inputs.txt')
  .toString()
  .split(',')

let data = inputs.map(item => parseInt(item));

// recurse through data, modifying it as we parse.
// given an array of integers and a starting point, parse the command and execute the appropriate action
let step = (data, start) => {
  if(data[start] != 1 && data[start] != 2){
    return data;
  }
  let item_one = data[start+1];
  let item_two = data[start+2];
  let destination = data[start+3];
  if(data[start] == 1){
    data[destination] = data[item_one] + data[item_two];
  } else {
    data[destination] = data[item_one] * data[item_two];
  }

  // when done, return the entire data set, the first entry will be the answer
  return step(data, start + 4);
}

console.log("Day 2 part 1:");
console.log(step(data, 0)[0]);

let noun = 0;
let verb = 0;
let target = 19690720;

console.log("Day 2 part 2:");

for(;noun<100;noun++){
  verb = 0;
  for(;verb<100;verb++){
    let data = inputs.map(item => parseInt((item)));
    data[1] = noun;
    data[2] = verb;
    let result = step(data, 0);
    if(result[0] === target){
      console.log('collision at:');
      console.log(noun + " " + verb);
      console.log("calculation: " + (100 * noun + verb));
    }
  }
}