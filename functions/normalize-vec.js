module.exports = (vec, scale) => {
  return {
    x: scale / (Math.abs(vec.x + vec.y)) * vec.x,
    y: scale / (Math.abs(vec.x + vec.y)) * vec.y
  }
}