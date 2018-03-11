module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    blueprintId: {
      type: 'number'
    },
    planetId: {
      type: 'number'
    },
    count: {
      type: 'number',
      minimum: 1
    }
  },
  required: ['token', 'blueprintId', 'planetId', 'count']
}