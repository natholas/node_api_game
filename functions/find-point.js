module.exports = (x, y, angle, distance) => {
  return {
    x: Math.round(Math.cos(angle * Math.PI / 180) * distance + x),
    y: Math.round(Math.sin(angle * Math.PI / 180) * distance + y)
  }
}