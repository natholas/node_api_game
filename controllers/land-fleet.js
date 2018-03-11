const sql = require('../connection')

module.exports = function (req, res) {
  var planet
  sql.query('SELECT * FROM celestial WHERE celestial_id = ? AND owner_id = ?', [req.body.planetId, req.user.id]).
  on('result', function(row) {
    planet = row
  })
  .on('result', function() {
    var result = null
    if (!planet) return res({ error: 'INVALID_PLANET_ID' })
    sql.query('UPDATE ship SET fleet_id = null, planet_id = ? WHERE fleet_id = ? AND owner_id = ? AND pos_x = ? AND pos_y = ?',
    [planet.celestial_id, req.body.fleetId, req.user.id, planet.pos_x, planet.pos_y])
    .on('result', function (row) {
      result = row
    })
    .on('end', function () {
      if (!result || result.affectedRows == 0) return res({ error: 'COULD_NOT_LAND' })
      sql.query('DELETE FROM fleet WHERE fleet_id = ?', [req.body.fleetId])
      return res({ error: false })
    })
  })
}