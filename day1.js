let fs = require('fs');

let input = fs.readFileSync('inputs/day1.txt').toString().split("\n");


let part1 = (data) => {
    let fuel = 0;

    data.forEach(item => {
        let res = Math.floor(item / 3) - 2;

        fuel += res;
    });

    return fuel;
};

let fuelForFuel = (weight, start) => {
    if(weight <= 0){
        return start;
    }
    let fuel = Math.floor(weight / 3) - 2;
    if(fuel < 0){
        return start;
    } else {
        return fuelForFuel(fuel, start + fuel);
    }
};

let part2 = (data) => {
    let totalFuel = 0;

    data.forEach(item => {
       let fuel = Math.floor(item / 3) - 2;
       totalFuel += fuel;
       totalFuel += fuelForFuel(fuel, 0);
    });

    return totalFuel;
};

console.log("Part 1:")
console.log(part1(input));

console.log("Part 2:");
console.log(part2(input));
