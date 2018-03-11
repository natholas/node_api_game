module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    fleetId: {
      type: 'number'
    },
    planetId: {
      type: 'number'
    }
  },
  required: ['token', 'fleetId', 'planetId']
}