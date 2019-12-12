const fs = require("fs");
const layers = fs
  .readFileSync("./inputs/day8inputs.txt", "utf8")
  .trim()
  .split("")
  .map(Number)
  .reduce((res, item, i) => {
    const j = Math.floor(i / (25 * 6));
    if (!res[j]) res[j] = [];
    res[j].push(item);
    return res;
  }, []);

Array.prototype.count = function(x) {
  return this.filter(y => x === y).length;
};

zeros = layers.map(layer => layer.count(0));
minLayer = layers[zeros.indexOf(Math.min.apply(null, zeros))];
console.log(minLayer.count(1) * minLayer.count(2));

layers[0].map((color, i) => {
  j = 0;
  while (color === 2) {
    color = layers[j][i];
    ++j;
  }
  process.stdout.write(color === 0 ? " " : "█");
  (i + 1) % 25 === 0 && console.log("");
});