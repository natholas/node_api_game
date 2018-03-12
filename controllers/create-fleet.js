const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  
  sql.query('SELECT * FROM ship WHERE ship_id IN (?) AND planet_id = ? AND owner_id = ? AND fleet_id IS NULL', [req.body.shipIds, req.body.planetId, req.user.id])
  .on('result', (row) => {
    rows.push(row)
  })
  .on('end', () => {
    if (!rows.length) return res({ error: 'NO_SHIPS_FOUND' })
    var planet
    sql.query('SELECT * FROM celestial WHERE celestial_id = ?', [req.body.planetId])
    .on('result', (row) => planet = row)
    .on('end', function() {
      var fleetId = null;
      sql.query('INSERT INTO fleet (pos_x, pos_y, owner_id) VALUES (?,?,?)', [planet.pos_x, planet.pos_y, req.user.id])
      .on('result', function(row) {
        fleetId = row.insertId
      })
      .on('end', function() {
        sql.query('UPDATE ship SET fleet_id = ?, planet_id = null WHERE ship_id IN (?) AND planet_id = ? AND owner_id = ? AND fleet_id IS NULL',
        [fleetId, req.body.shipIds, planet.celestial_id, req.user.id])
        .on('end', function() {
          return res({ error: false })
        })
      })
    })
  })
}