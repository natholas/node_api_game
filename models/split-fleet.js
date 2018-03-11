module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    fleetId: {
      type: 'number'
    },
    shipIds: {
      type: 'array',
      items: {
        type: 'number'
      }
    }
  },
  required: ['token', 'fleetId', 'shipIds']
}