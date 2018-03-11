const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  var fleetId = null;
  sql.query('INSERT INTO fleet (pos_x, pos_y) VALUES (?,?)', [req.body.pos_x, req.body.pos_y])
  .on('result', function(row) {
    fleetId = row.insertId
  })
  .on('end', function() {
    var response
    sql.query('UPDATE ship SET fleet_id = ?, planet_id = null WHERE ship_id IN (?) AND pos_x = ? AND pos_y = ? AND owner_id = ?',
    [fleetId, req.body.shipIds, req.body.pos.x, req.body.pos.y, req.user.id])
    .on('result', function(row) {
      response = row
    })
    .on('end', function() {
      console.log(response);
      if (response.affectedRows == 0) return res({ error: 'NO_SHIPS_FOUND' })
      return res({ error: false })
    })
  })
}