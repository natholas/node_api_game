const sql = require('../connection')
const resourceConfig = require('../config/resource-config')

module.exports = function (req, res) {
  var rows = []
  sql.query('SELECT * FROM my_celestial WHERE celestial_id = ? AND owner_id = ?', [req.body.celestialId, req.user.id])
  .on('result', function (row) {
    rows.push(row)
  })
  .on('end', function () {
    if (!rows.length) return res({ error: 'INVALID_CELESTIAL_ID' })
    result = rows[0]

    let currentLevel = result[req.body.type + '_level']
    let level = currentLevel + 1

    let metalNeeded = resourceConfig.baseResourceNeeds[req.body.type].metal * level * level * level
    let mineralNeeded = resourceConfig.baseResourceNeeds[req.body.type].mineral * level * level * level

    if (metalNeeded > result.metal_storage || mineralNeeded > result.mineral_storage) {
      return res({ error: 'NOT_ENOUGH_RESOURCES', metalNeeded: metalNeeded, mineralNeeded: mineralNeeded })
    }

    var params = [
      {
        metal_storage: result.metal_storage - metalNeeded
      },
      {
        mineral_storage: result.mineral_storage - mineralNeeded
      },
      {
        [req.body.type + '_level']: level
      },
      result.celestial_facilities_id
    ]
    
    sql.query('UPDATE celestial_facilities SET ?, ?, ? WHERE celestial_facilities_id = ?', params)
    .on('end', function() {
      return res({ error: false, newLevel: level, metalUsed: metalNeeded, mineralUsed: mineralNeeded })
    })

  })
}