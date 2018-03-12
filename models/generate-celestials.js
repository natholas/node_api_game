module.exports = {
  properties: { 
    token: {
      type: 'string'
    },
    xRange: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 2,
      maxItems: 2,
    },
    yRange: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 2,
      maxItems: 2,
    },
    starCount: {
      type: 'number'
    }
  },
  required: ['token', 'xRange', 'yRange', 'starCount']
}