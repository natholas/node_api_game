const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  var fleetId = null;
  sql.query('INSERT INTO fleet (pos_x, pos_y) VALUES (?,?)', [req.body.pos_x, req.body.pos_y])
  .on('result', function(row) {
    fleetId = row.insertId
  })
  .on('end', function() {
    sql.query('UPDATE ship SET fleet_id = ?, planetId = null WHERE ship_id IN (?) AND pos_x = ? AND pos_y = ?)',
    [fleetId, body.req.shipIds, req.body.pos_x, req.body.pos_y])
    .on('end', function() {
      return result({ error: false })
    })
  })
}