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
            result = memory[base + memory[address]];
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

    if(mode === 2 && (base + address) >= memory.length){
        memory = [...memory].concat([...'0'.repeat((base + memory[address]) - memory.length + 1)].map(Number));
    }

    if(mode === 2){
        memory[base + address] = value;
    } else {
        memory[address] = value;
    }

    return memory;
};

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

                let destination = memory[currPointer + 1];

                memory = setMemoryAddress(memory, destination, command.modes[0], input, base);
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
                let offset = 0;
                if(command.modes[0] === 2){
                    if((base + memory[currPointer + 1]) >= memory.length){
                        memory = [...memory].concat([...'0'.repeat((base + memory[currPointer + 1]) - memory.length + 1)].map(Number));
                    }
                    base += memory[base + memory[currPointer + 1]];

                } else {
                    offset = getMemoryAddress(memory, currPointer + 1, command.modes[0], base, expandMem);
                    if(!command.modes.length){
                        offset = memory[offset];
                    }
                    base += offset;
                }
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

let getBOOST = (program, ...inputs) => {
    let tester = process(program, ...inputs);
    let result, value, done;

    while(!done){
        ({value, done} = tester.next());
        if(value != null){
            result = value;
        }
    }

    return result;
};


console.log("Day 9 Part 1:");
let result = getBOOST(input, 1);
console.log(result);

console.log("Day 9 Part 2:");
result = getBOOST(input, 2);
console.log(result);
