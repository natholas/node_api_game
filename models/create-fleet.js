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
  required: ['token', 'shipIds', 'pos']
}