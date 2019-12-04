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
      if(line[0] === lastx){
        if(line[1] > lasty){
          // going U, if line[1] > point.y > lasty then point is on this line
          if(line[1] > point.y > lasty){
            return currPathLen + Math.abs(point.y - lasty);
          }
          currPathLen += Math.abs(lasty - line[1]);
        } else {
          // going D, if lasty > point.y > line[1] then point is on this line
          if(lasty < 0 || line[1] < 0){
            if(lasty < point.y < line[1]){
              return currPathLen + Math.abs(point.y - line[1]);
            }
          } else {
            if(lasty > point.y > line[1]){
              return currPathLen + Math.abs(point.y - line[1]);
            }
          }

          currPathLen += Math.abs(line[1] - lasty);
        }
      } else {
        if(line[0] > lastx){
          // going R, if line[0] > point.x > lastx then point is on this line
          if(line[0] > point.x > lastx){
            return currPathLen + Math.abs(point.x - lastx);
          }
          currPathLen += Math.abs( lastx - line[0]);
        } else {
          // going L, if lastx > point.x > line[0] then point is on this line
          if(lastx < 0 || line[0] < 0){
            if(lastx < point.x < line[0]){
              return currPathLen + Math.abs(point.x - line[0]);
            }
          } else {
            if(lastx > point.x > line[0]){
              return currPathLen + Math.abs(point.x - line[0]);
            }
          }
          currPathLen += Math.abs(line[0] - lastx);
        } // if we haven't found the path, add x distance to currPathLen

      }

  }
}

console.log(generateSVG(wire1));
console.log(generateSVG(wire2));

let w1P2P = getShortestPath(generateSVG(wire1), distance.collision);
let w2P2P = getShortestPath(generateSVG(wire2), distance.collision);

console.log("Day 3 Part 2:");
console.log(w1P2P + w2P2P);