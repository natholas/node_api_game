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

    UPDATE research RE, celestial_facilities CF
    SET RE.percent = RE.percent + CF.research_level
    WHERE RE.planet_id = CF.planet_id AND RE.status = 'IN_PROGRESS';
  `)

  var affectInsertQuery = 'INSERT INTO research_effect (research_id, type, amount) VALUES '
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
      affectInsertQuery += '('
      affectInsertQuery += effect.id + ', "' + effect.type + '", ' + effect.amount
      affectInsertQuery += '),'
    }
  })
  .on('end', function() {
    affectInsertQuery = affectInsertQuery.substring(0, affectInsertQuery.length - 1)
    if (affectInsertQuery.length > 62) {
      sql.query(affectInsertQuery)
    }
  })
}