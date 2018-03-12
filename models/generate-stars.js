module.exports = {
  properties: { 
    token: {
      type: 'string'
    },
    xRange: {
      type: 'array',
      items: 'number',
      minItems: 2,
      maxItems: 2,
    },
    yRange: {
      type: 'array',
      items: 'number',
      minItems: 2,
      maxItems: 2,
    },
    numberOfStars: {
      type: 'number'
    }
  },
  required: ['token', 'xRange', 'yRange', 'numberOfStars']
}