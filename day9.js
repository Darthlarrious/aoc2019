let fs = require('fs');

let rawInput = fs.readFileSync('inputs/day9inputs.txt').toString().split(",");
let input = rawInput.map(item => parseInt(item));

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result;
}

let parseCommand = (input) => {
  let result = {};

  result.command = input % 100;
  let modes = Math.floor(input / 100);
  result.modes = [];
  if(modes > 0){

    while(modes > 0){
      let currMode = modes % 10;
      result.modes.push(currMode);
      modes = Math.floor(modes / 10);
    }
  }
  switch(result.command){
    case 1:
      result.offset = 4;
      break;
    case 2:
      result.offset = 4;
      break;
    case 3:
      result.offset = 2;
      break;
    case 4:
      result.offset = 2;
      break;
    case 5:
      result.offset = 3;
      break;
    case 6:
      result.offset = 3;
      break;
    case 7:
      result.offset = 4;
      break;
    case 8:
      result.offset = 4;
      break;
    case 9:
      result.offset = 2;
      break;
    default:
      result.offset = 0;
      break;
  }


  return result;
};

let getMemoryAddress = (memory, address, mode, base, ouchFunc) => {
  let result;

  if((mode ? address :  memory[address]) >= memory.length){
    memory = ouchFunc(mode ? address : memory[address]);
  }

  if(mode === 2 && base + memory[address] >= memory.length){
    memory = ouchFunc(base + memory[address]);
  }

  switch(mode){
    case 0:
      result = memory[memory[address]];
      break;
    case 1:
      result = memory[address];
      break;
    case 2:
      result = base + memory[address];
      break;
    default:
      result = memory[address];
      break;
  }

  return result;
};

let setMemoryAddress = (memory, address, mode, value, base) => {
  if(address >= memory.length){
    memory = [...memory].concat([...'0'.repeat(address - memory.length + 1)].map(Number));
  }

  if((base + memory[address]) >= memory.length){
    memory = [...memory].concat([...'0'.repeat((base + memory[address]) - memory.length + 1)].map(Number));
  }

  if(mode === 2){
    memory[base + memory[address]] = value;
  } else {
    memory[address] = value;
  }

  return memory;
}

function* process(memory, ...inputs){
  let currPointer = 0;
  let base = 0;

  function expandMem(maxNum) {
    memory = [...memory].concat([...'0'.repeat(maxNum - memory.length + 1)].map(Number));

    return memory;
  }

  while(memory[currPointer] !== 99){
    let command = parseCommand(memory[currPointer]);

    switch(command.command){
      case 1:
        let add1 = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        let add2 = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
        let addDestination = memory[currPointer + 3];

        memory = setMemoryAddress(memory, addDestination, command.modes[2], add1 + add2, base);
        break;
      case 2:
        let mult1 = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        let mult2 = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
        let multDestination = memory[currPointer + 3];

        memory = setMemoryAddress(memory, multDestination, command.modes[2], mult1 * mult2, base);
        break;
      case 3:
        let tempInput = yield;
        if (tempInput != null) inputs = Array.isArray(tempInput) ? tempInput : [tempInput];
        let input = inputs.shift();

        let destination = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);

        memory = setMemoryAddress(memory, destination, 0, input, base);
        break;
      case 4:
        let value = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);

        if(!command.modes.length) {
          value = memory[value];
        }

        yield value;
        break;
      case 5:
        let c5param = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        if(c5param !== 0){
          let newPointer = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
          command.offset = 0;
          currPointer = newPointer;
        }
        break;
      case 6:
        let c6param = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        if(c6param === 0){
          let newPointer = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
          command.offset = 0;
          currPointer = newPointer;
        }
        break;
      case 7:
        let c7param1 = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        let c7param2 = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
        let c7addr = memory[currPointer + 3];

        memory = setMemoryAddress(memory, c7addr, command.modes[2], c7param1 < c7param2 ? 1 : 0, base);


        break;
      case 8:
        let c8param1 = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        let c8param2 = getMemoryAddress(memory, currPointer + 2, command.modes[1], base, expandMem);
        let addr = memory[currPointer + 3];

        memory = setMemoryAddress(memory, addr, command.modes[2], c8param1 === c8param2 ? 1 : 0, base);

        break;
      case 9:
        let offset = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
        base += offset;
        break;
    }
    currPointer = currPointer + command.offset;
  }
}

let getFeedbackForSequence = (program, ampSettings) => {
  let amps = ampSettings.map(p => process(program.slice(), p, 0));

  let result;
  let value, done;
  let i = 0;

  while(!done){
    ({value, done} = amps[i % ampSettings.length].next(result));
    if (value != null) result = value;
    i++;
  }

  return result;
};

let getBOOST = (program) => {
  let tester = process(program, 1);
  let result, value, done;

  while(!done){
    ({value, done} = tester.next());
    if(value != null){
      console.log(value);
    }
  }

  return result;
};

//let testInput = "1102,34915192,34915192,7,4,7,99,0".split(",").map(Number);
//let testInput = "104,1125899906842624,99".split(",").map(Number);
//let testInput = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99".split(",").map(Number);

//let value,done;
//let proc = process(testInput);
//while(!done){
//  ({value, done} = proc.next());
//  console.log(value);
//}

let result = getBOOST(input);


console.log("Day 9 Part 1:")
//console.log(result);

