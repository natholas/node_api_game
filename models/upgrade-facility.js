module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    celestialId: {
      type: 'number'
    },
    type: {
      enum: ['metal', 'mineral', 'energy', 'production', 'research']
    }
  },
  required: ['token', 'celestialId', 'type']
}