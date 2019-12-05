let fs = require('fs');

let rawInput = fs.readFileSync('inputs/day5inputs.txt').toString().split(",");
let input = rawInput.map(item => parseInt(item));

/*let step = (data, start) => {
    if(data[start] != 1 && data[start] != 2){
        return data;
    }
    if(data[start] == 1){
        let register1 = data[start+1];
        let register2 = data[start+2];
        let resultRegister = data[start+3];

        data[resultRegister] = data[register1] + data[register2];
    } else {
        let register1 = data[start+1];
        let register2 = data[start+2];
        let resultRegister = data[start+3];

        data[resultRegister] = data[register1] * data[register2];
    }

    return step(data, start + 4);
};*/

let step = (data, start, inputs) => {
    let command = parseCommand(data[start]);
    switch(command.command){
        case 1:
            let add1 = data[start + 1];
            let add2 = data[start + 2];
            let addDestination = data[start + 3];

            if(command.modes[0] === undefined || command.modes[0] === 0){
                add1 = data[add1];
            }
            if(command.modes[1] === undefined || command.modes[1] === 0){
                add2 = data[add2];
            }

            data[addDestination] = add1 + add2;
            break;
        case 2:
            let mult1 = data[start + 1];
            let mult2 = data[start + 2];
            let multDestination = data[start + 3];

            if(command.modes[0] === undefined || command.modes[0] === 0){
                mult1 = data[mult1];
            }
            if(command.modes[1] === undefined || command.modes[1] === 0){
                mult2 = data[mult2];
            }

            data[multDestination] = mult1 * mult2;
            break;
        case 3:
            let input = inputs[0];
            inputs = inputs.slice(1);

            let destination = data[start + 1];

            data[destination] = input;
            break;
        case 4:
            let value = data[start + 1];

            if(command.modes[0] === undefined || command.modes[0] === 0){
                value = data[value]
            }

            console.log(value);
            break;
        case 5:
            let c5param = data[start + 1];
            if(command.modes[0] === undefined || command.modes[0] === 0){
                c5param = data[c5param];
            }
            if(c5param !== 0){
                let newPointer = data[start + 2];
                if(command.modes[1] === undefined || command.modes[1] === 0){
                    newPointer = data[newPointer];
                }
                command.offset = 0;
                start = newPointer;
            }
            break;
        case 6:
            let c6param = data[start + 1];
            if(command.modes[0] === undefined || command.modes[0] === 0){
                c6param = data[c6param];
            }
            if(c6param === 0){
                let newPointer = data[start + 2];
                if(command.modes[1] === undefined || command.modes[1] === 0){
                    newPointer = data[newPointer];
                }
                command.offset = 0;
                start = newPointer;
            }
            break;
        case 7:
            let c7param1 = data[start + 1];
            let c7param2 = data[start + 2];

            if(command.modes[0] === undefined || command.modes[0] === 0){
                c7param1 = data[c7param1];
            }
            if(command.modes[1] === undefined || command.modes[1] === 0){
                c7param2 = data[c7param2];
            }

            data[data[start + 3]] = c7param1 < c7param2 ? 1 : 0;

            break;
        case 8:
            let c8param1 = data[start + 1];
            let c8param2 = data[start + 2];

            if(command.modes[0] === undefined || command.modes[0] === 0){
                c8param1 = data[c8param1];
            }
            if(command.modes[1] === undefined || command.modes[1] === 0){
                c8param2 = data[c8param2];
            }

            data[data[start + 3]] = c8param1 == c8param2 ? 1 : 0;

            break;
        case 99:
        default:
            return data;
            break;
    }

    step(data, start + command.offset, inputs);
};

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
      default:
          result.offset = 0;
          break;
  }


  return result;
};

console.log("Day 5 Part 1:");
step(input, 0, [1]);

let input2 = rawInput.map(item => parseInt(item))
console.log("Day 5 Part 2:");
step(input2, 0, [5]);
