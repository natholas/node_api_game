const sql = require('./connection')

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

  sql.query("SELECT * FROM research WHERE status = 'IN_PROGRESS' AND percent >= 100")
  .on('result', function(research) {
    console.log('---------------   Need to create research affects and insert them -----------');
  })
}