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

let findClosestCommonNode = (paths, startA, startB) => {
  let pathToCOG1 = [];
  let pathToCOG2 = [];
  let currOrbit = paths[startA];
  while (currOrbit.direct !== "COM"){
      pathToCOG1.push(currOrbit.direct);
      currOrbit = paths[currOrbit.direct];
  }
  currOrbit = paths[startB];
  while (currOrbit.direct !== "COM"){
    pathToCOG2.push(currOrbit.direct);
    currOrbit = paths[currOrbit.direct];
  }

  let commonPath = pathToCOG1.filter(item => pathToCOG2.indexOf(item) !== -1);

  return commonPath[0];
}


// leverages the cached distances used in part 1
let distanceBetweenNodes = (paths, startA, startB, memory) => {
  let commonNode = findClosestCommonNode(paths, startA, startB);

  let pathToCommonA = memory[startA] - memory[commonNode];
  let pathToCommonB = memory[startB] - memory[commonNode];

  return pathToCommonA + pathToCommonB - 2;
}

console.log("Day 2 Part 2");
console.log(distanceBetweenNodes(paths, "YOU", "SAN", memory))