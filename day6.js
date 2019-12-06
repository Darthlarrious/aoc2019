let fs = require('fs');

let rawInput = fs.readFileSync('inputs/day6inputs.txt').toString().split("\r\n");

let paths = {};


rawInput.forEach(orbit => {
  let path = orbit.split(")");
  if(paths[path[1]] === undefined){
    paths[path[1]] = {"direct": path[0]}
  }
});

let totalOrbits = (orbits) => {
  let result = 0;
  Object.keys(orbits).forEach(link => {
    result += memoizeOrbit(link);
  });
  return result;
}

let memory = {};
let memoizeOrbit = (link) => {
  if(memory[link] !== undefined){
    return memory[link];
  }
  let result = 1;
  let tempMemory = {};
  let currOrbit = paths[link];
  while (currOrbit.direct !== "COM"){
    if(memory[currOrbit.direct] === undefined){
      result++;
      tempMemory[currOrbit.direct] = {"item": currOrbit.direct, "distance":result - 1};
      currOrbit = paths[currOrbit.direct];
    } else {
      result += memory[currOrbit.direct];
      break;
    }

  }
  memory[link] = result;

  Object.keys(tempMemory).forEach(temp => {
    memory[tempMemory[temp].item] = result - tempMemory[temp].distance;
  });
  return result;
}

console.log("Day 6 Part 1:");
console.log(totalOrbits(paths));

