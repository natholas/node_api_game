module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    type: {
      enum: ['corvette', 'cruiser', 'frigate', 'battle-ship']
    },
    name: {
      type: 'string'
    },
    researchIds: {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      items: {
        type: 'number'
      }
    }
  },
  required: ['token', 'celestialId', 'researchIds']
}