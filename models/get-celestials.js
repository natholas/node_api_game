module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    pos: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      },
      required: ['x', 'y']
    }
  },
  required: ['token', 'pos']
}