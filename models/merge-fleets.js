module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    fleetIds: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 2
    }
  },
  required: ['token', 'fleetIds']
}