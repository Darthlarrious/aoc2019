let fs = require('fs');
let input = fs.readFileSync('inputs/day10inputs.txt').toString().split("\n");

let asteroids = [];

input.map((row, y) => {
    let columns = row.split('');
    columns.map((location, x) =>{
        if(location === "#"){
            asteroids.push({x: x, y:y, id:asteroids.length});
        }
    });
});

let sameSlope = (source, destination, asteroid) => {
    return (asteroid.y - source.y) * (destination.x - source.x) === (destination.y - source.y) * (asteroid.x - source.x);
};

let hasLOS = (asteroids, asteroidA, asteroidB) => {
  let source = asteroids[asteroidA];
  let destination = asteroids[asteroidB];

  // find all asteroids on the same slope as A->B
  let onSlope = asteroids.filter((roid, id) =>{
      if(id === asteroidA || id === asteroidB){
          return false;
      }
      return sameSlope(source, destination, roid);
  });

  // find any that are between A and B
    // finds any points closer to A than B on the A->B slope
    // AND in the same direction as B
    let visibility = onSlope.filter(asteroid => {
        let leftMost = source.x > destination.x ? destination : source;
        let rightMost = source.x > destination.x ? source : destination;

        let topMost = source.y > destination.y ? destination : source;
        let bottomMost = source.y > destination.y ? source : destination;

        let xWithin = leftMost.x <= asteroid.x && asteroid.x <= rightMost.x;
        let yWithin = topMost.y <= asteroid.y && asteroid.y <= bottomMost.y;

        return xWithin && yWithin;
    });
  return visibility.length === 0;
};

let findVisible = (asteroids, asteroidID) => {
      return asteroids.filter(asteroid => {
          return asteroid.id === asteroidID ?
              false :
              hasLOS(asteroids, asteroidID, asteroid.id)
      });
};

let distances = asteroids.map(roid =>({
    id:roid.id,
    visible:findVisible(asteroids, roid.id).length
}));

let best = distances.sort((a,b) => b.visible - a.visible)[0];

console.log("Day 10 Part 1:");
console.log(best.visible);

let  cartesian2Polar = (x, y) => {
    let distance = Math.sqrt(x*x + y*y)
    let radians = Math.atan2(y,x); //This takes y first
    radians = radians < 0 ? radians + Math.PI * 2 : radians;
    return {distance: distance, radians: radians}
};

let polars = asteroids.map((center, id) =>{
    let others = asteroids.filter((c,i)=>i!==id);
    //set origin to center and calculate distance and radians for each other asteroid
    return others.map(other =>{
      let translatedX = other.x - center.x;
      let translatedY = other.y - center.y;

      return {...cartesian2Polar(translatedX, translatedY), id:asteroids.indexOf(other)}
    })
})[best.id].sort((a,b)=>{
    let mainSort = a.radians - b.radians;
    if(mainSort === 0){
        mainSort = a.distance - b.distance;
    }
    return mainSort;
});

console.log(polars);
