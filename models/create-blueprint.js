module.exports = {
  properties: {
    token: {
      type: 'string'
    },
    type: {
      enum: ['corvette', 'cruiser', 'frigate', 'battleShip', 'colonyShip']
    },
    name: {
      type: 'string'
    },
    researchIds: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'number'
      }
    }
  },
  required: ['token', 'type', 'name','researchIds']
}