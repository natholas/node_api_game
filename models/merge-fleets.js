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
    },
    pos: {
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
    }
  },
  required: ['token', 'fleetIds', 'pos']
}