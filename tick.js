const sql = require('./connection')
const researchConfig = require('./config/research-config')
const randomInt = require('./functions/random-int')

module.exports = function () {
  sql.query(`
    UPDATE celestial_facilities
    SET mineral_storage = mineral_storage + (mineral_level * 4)
    WHERE energy_level >= mineral_level;
    
    UPDATE celestial_facilities
    SET mineral_storage = mineral_storage + FLOOR(4 * (mineral_level / (mineral_level - energy_level)))
    WHERE energy_level < mineral_level;
    
    UPDATE celestial_facilities
    SET metal_storage = metal_storage + (metal_level * 4)
    WHERE energy_level >= metal_level;
    
    UPDATE celestial_facilities
    SET metal_storage = metal_storage + FLOOR(4 * (metal_level / (metal_level - energy_level)))
    WHERE energy_level < metal_level;

    UPDATE research
    SET status = 'DONE'
    WHERE status = 'IN_PROGRESS'
    AND percent >= 100;

    UPDATE ship
    SET status = 'DONE'
    WHERE status = 'IN_PROGRESS'
    AND build_points >= total_build_points;

    update research
    join research_planet on research_planet.research_id = research.research_id
    SET research.percent = research.percent + research_planet.research_level;

    update ship
    join production_planet on production_planet.ship_id = ship.ship_id
    SET ship.build_points = ship.build_points + production_planet.production_level;

    UPDATE fleet
    SET pos_x = target_pos_x, pos_y = target_pos_y, speed_x = 0, speed_y = 0, target_pos_x = null, target_pos_y = null
    WHERE mission != 'IDLE' AND ABS(pos_x - target_pos_x) < ABS(speed_x);

    UPDATE fleet
    SET pos_x = pos_x + speed_x, pos_y = pos_y + speed_y
    WHERE MISSION != 'IDLE' AND target_pos_x IS NOT NULL AND target_pos_y IS NOT NULL;

    DELETE fleet FROM fleet
    LEFT JOIN ship ON ship.fleet_id = fleet.fleet_id
    WHERE ship_id IS NULL;
  `)

  var researchQuery = 'INSERT INTO research_effect (research_id, type, amount) VALUES '
  sql.query("SELECT * FROM research WHERE status = 'IN_PROGRESS' AND percent >= 100")
  .on('result', function(research) {
    let effects = []
    for (let i = 0; i < researchConfig.effectsPerResearch; i++) {
      effects.push({
        id: research.research_id,
        type: researchConfig.researchEffects[randomInt(0, researchConfig.researchEffects.length)],
        amount: 1 + (Math.random() * researchConfig.effectStrength)
      })
    }

    for (let i = 0; i < researchConfig.sideEffectsPerResearch; i++) {
      effects.push({
        id: research.research_id,
        type: researchConfig.researchEffects[randomInt(0, researchConfig.researchEffects.length)],
        amount: 1 / (Math.random() * researchConfig.effectStrength)
      })
    }

    for (var effect of effects) {
      researchQuery += '('
      researchQuery += effect.id + ', "' + effect.type + '", ' + effect.amount
      researchQuery += '),'
    }
  })
  .on('end', function() {
    researchQuery = researchQuery.substring(0, researchQuery.length - 1)
    if (researchQuery.length > 62) {
      sql.query(researchQuery)
    }
  })

  var fleetQuery = ''
  sql.query('SELECT * FROM fleet WHERE mission != "IDLE" AND speed_x = 0 AND speed_y = 0')
  .on('result', (fleet) => {
    // console.log(fleet)
    if (fleet.mission == 'COLONIZE') {
      fleetQuery += `
      UPDATE celestial
      JOIN colony_ship ON colony_ship.celestial_id = celestial.celestial_id
      JOIN ship ON colony_ship.ship_id = ship.ship_id
      SET celestial.owner_id = colony_ship.fleet_owner,
      ship.status = 'DELETE',
      ship.fleet_id = NULL,
      ship.owner_id = NULL
      WHERE colony_ship.fleet_id = ` + fleet.fleet_id + `;`
    }
  })
  .on('end', () => {
    fleetQuery += `DELETE FROM ship WHERE status = 'DELETE';
    DELETE fleet FROM fleet LEFT JOIN ship ON ship.fleet_id = fleet.fleet_id WHERE ship_id IS NULL;`
    sql.query(fleetQuery)
  })
}