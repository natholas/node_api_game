const sql = require('../connection')
const blueprintConfig = require('../config/blueprint-config')
const copyObj = require('../functions/copy-object')

module.exports = function (req, res) {
  var rows = []
  sql.query('SELECT * FROM blueprint_details WHERE blueprint_id = ? AND owner_id = ?', [req.body.blueprintId, req.user.id])
  .on('result', function(row) {
    rows.push(row)
  })
  .on('end', function() {
    if (!rows.length) return res({ error: 'BLUEPRINT_NOT_FOUND' })
    let blueprint = rows[0]
    let celestials = []
    sql.query('SELECT * FROM my_celestial WHERE celestial_id = ? AND owner_id = ?', [req.body.planetId, req.user.id])
    .on('result', function(row) {
      celestials.push(row)
    })
    .on('end', function() {
      if (!celestials.length) return res({ error: 'INVALID_PLANET_ID' })
      let planet = celestials[0]
      if (planet.metal_storage < blueprint.metal_cost * req.body.count) return res({ error: 'NOT_ENOUGH_METAL' })
      if (planet.mineral_storage < blueprint.mineral_cost * req.body.count) return res({ error: 'NOT_ENOUGH_MINERAL' })

      // Calculating resources
      let metal = planet.metal_storage - (blueprint.metal_cost * req.body.count)
      let mineral = planet.mineral_storage - (blueprint.mineral_cost * req.body.count)

      // Reducing resources
      sql.query('UPDATE celestial_facilities SET metal_storage = ?, mineral_storage = ? WHERE planet_id = ?', [metal, mineral, req.body.planetId])
      .on('end', function() {
        let template = copyObj(blueprintConfig[blueprint.blueprint_type])
        let health = template.baseStats.health
        let damage = template.baseStats.damage
        let speed = template.baseStats.speed

        for (let effect of rows) {
          if (effect.type == 'health') health *= effect.amount
          if (effect.type == 'damage') damage *= effect.amount
          if (effect.type == 'speed') speed *= effect.amount
        }
  
        // Adding ship
        let params = []
        let string = ''
        for (let i = 0; i < req.body.count; i++) {
          params.push(req.user.id, planet.celestial_id, blueprint.blueprint_id, health, damage, speed, blueprint.production_cost)
          string += '(?,?,?,?,?,?,?),'
        }
        string = string.substring(0,string.length - 1)
        sql.query('INSERT INTO ship (owner_id, planet_id, blueprint_id, health, damage, speed, total_build_points) VALUES ' + string,
        params)
        .on('end', function() {
          return res({ error: false })
        })
      })
    })
  })
}