module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    fleetId: {
      type: 'number'
    },
    targetPos: {
      type: 'object',
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        }
      },
      required: ['x', 'y']
    },
    mission: {
      enum: ['attack', 'move', 'colonize']
    }
  },
  required: ['token', 'fleetId', 'targetPos', 'mission']
}