module.exports = (x, y, angle, distance) => {
  var result = {};
  result.x = Math.cos(angle * Math.PI / 180) * distance + x;
  result.y = Math.sin(angle * Math.PI / 180) * distance + y;
  return result;
}