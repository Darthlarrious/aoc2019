let fs = require('fs');
var svgIntersections = require('svg-intersections');
var intersect = svgIntersections.intersect;
var shape = svgIntersections.shape;


let input = fs.readFileSync('inputs/day3.txt').toString().split("\n");

let wire1 = input[0].split(",");
let wire2 = input[1].split(",");

// Generate SVG for each path, to allow svg-intersection library to
// find collisions
let generateSVG = (wire) => {
    let pathsvg = "M 0 0";

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

    return distances[0];
};

let distance = getClosestCollision(wire1, wire2);
console.log(distance);
