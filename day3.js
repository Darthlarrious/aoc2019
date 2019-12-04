let fs = require('fs');
var svgIntersections = require('svg-intersections');
var intersect = svgIntersections.intersect;
var shape = svgIntersections.shape;


let input = fs.readFileSync('inputs/day3inputs.txt').toString().split("\n");

let wire1 = input[0].split(",");
let wire2 = input[1].split(",");

// Generate SVG for each path, to allow svg-intersection library to
// find collisions
let generateSVG = (wire) => {
    let pathsvg = "M 0,0";

    let currX = 0;
    let currY = 0;

    wire.forEach(link =>{
        let direction = link.substring(0,1);
        let distance = parseInt(link.substring(1));

            switch(direction){
                case "U":
                    currY += distance;
                    break;
                case "D":
                    currY -= distance;
                    break;
                case "L":
                    currX -= distance;
                    break;
                case "R":
                    currX += distance;
                    break;
                default:
                    break;
            }
            pathsvg += " " + currX + "," + currY;
    });

    return pathsvg;
};


// manhattan distance to origin (0,0)
let distanceFromOrigin = (point) => {
    let xdistance = Math.abs(point.x);
    let ydistance = Math.abs(point.y);

    return xdistance + ydistance;

};

let getCollisions = (wire1, wire2) => {
    return intersect(
        shape("path", { d: generateSVG(wire1) }),
        shape("path", { d: generateSVG(wire2) })
        );
};

// Calculate closest collisions
let getClosestCollision = (wire1, wire2) => {
    let collisions = getCollisions(wire1, wire2);

    let distances = collisions.points.map((point, index) => {return {"index": index, "distance": distanceFromOrigin(point)}});

    distances.sort((wireA, wireB) => {return wireA.distance - wireB.distance});

    return {distance: distances[0], collision: collisions.points[distances[0].index]};
};

let distance = getClosestCollision(wire1, wire2);
console.log("Day 3 Part 1:");
console.log(distance);

// using the generated SVG Path string, determine the closest intersect
let getShortestPath = (wire, point) => {
  let path = wire.substring(6);
  let data = path.split(" ");

  let lastx = 0;
  let lasty = 0;

  let currPathLen = 0;


  for(let step in data){
      let line = data[step].split(',').map(item => parseInt(item));

      if(line[0] === lastx && lastx === point.x){
        // desired point is on the plane, check if it's between the points
        if(line[1] > lasty){
          if(lasty <= point.y && point.y <= line[1] ){
            return currPathLen + Math.abs(point.y - lasty);
          }
          currPathLen += Math.abs(line[1] - lasty);
        } else {
          if(lasty >= point.y && point.y >= line[1]){
            return currPathLen + Math.abs(lasty - point.y);
          }
          currPathLen += Math.abs(lasty - line[1]);
        }

      } else if(line[1] === lasty && lasty === point.y){
        // desired point is on the plane, check if it's between the points

        if(line[0] > lastx){
          if(lastx <= point.x && point.x <= line[0]){
            return currPathLen + Math.abs(point.x - lastx);
          }
          currPathLen += Math.abs(line[0] - lastx);
        } else {
          if(lastx >= point.x && point.x >= line[0]){
            return currPathLen + Math.abs( lastx - point.x);
          }
          currPathLen += Math.abs(lastx - line[0]);
        }
      } else {
        if(lastx === line[0]){
          currPathLen += Math.abs(line[1] - lasty);
        } else {
          currPathLen += Math.abs(line[0] - lastx);
        }
      }


      lastx = line[0];
      lasty = line[1];

  }

  return currPathLen;
}

//let tw1 = "R8,U5,L5,D3".split(",");
//let tw2 = "U7,R6,D4,L4".split(",");
//let w1 = generateSVG(tw1);
//let w2 = generateSVG(tw2);

let w1 = generateSVG(wire1);
let w2 = generateSVG(wire2);

let collisions = getCollisions(wire1, wire2);
let results = collisions.points.map(point => {
  let len1 = getShortestPath(w1, point);
  let len2 = getShortestPath(w2, point);

  return len1 + len2;
});

console.log(results.sort((a,b)=> {return a-b})[0]);