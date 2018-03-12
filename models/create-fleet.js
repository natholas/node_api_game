module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    shipIds: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 1
    },
    planetId: {
      type: 'number'
    }
  },
  required: ['token', 'shipIds']
}