const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  var fleetId = null;
  sql.query('INSERT INTO fleet (pos_x, pos_y, owner_id) VALUES (?,?,?)', [req.body.pos.x, req.body.pos.y, req.user.id])
  .on('result', function(row) {
    fleetId = row.insertId
  })
  .on('end', function() {
    var response
    sql.query('UPDATE ship SET fleet_id = ?, planet_id = null WHERE ship_id IN (?) AND pos_x = ? AND pos_y = ? AND owner_id = ? AND fleet_id IS NULL',
    [fleetId, req.body.shipIds, req.body.pos.x, req.body.pos.y, req.user.id])
    .on('result', function(row) {
      response = row
    })
    .on('end', function() {
      if (!response || response.affectedRows == 0) return res({ error: 'NO_SHIPS_FOUND' })
      return res({ error: false })
    })
  })
}