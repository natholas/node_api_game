module.exports = (vec, scale) => {
  var point = {x: vec.x, y: vec.y}
  var norm = Math.sqrt(point.x * point.x + point.y * point.y);
  if (norm != 0) {
    point.x = scale * point.x / norm;
    point.y = scale * point.y / norm;
  }
  return point
}