module.exports = (vec, scale) => {
  return {
    x: scale / (vec.x + vec.y) * vec.x,
    y: scale / (vec.x + vec.y) * vec.y
  }
}