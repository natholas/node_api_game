const sql = require('../connection')

module.exports = function(req, res) {
  var rows = []
  var result
  sql.query('SELECT * FROM fleet WHERE fleet_id = ? AND owner_id = ?', [req.body.fleetIds[0], req.user.id])
  .on('result', function(row) {
    result = row
  })
  .on('end', function() {
    if (!result) return res({ error: 'INVALID_FLEET_ID' })
    sql.query('UPDATE ship SET fleet_id = ? WHERE fleet_id IN (?) AND owner_id = ? AND pos_x = ? AND pos_y = ?',
    [req.body.fleetIds[0], req.body.fleetIds, req.user.id, req.body.pos.x, req.body.pos.y])
    .on('end', () => {
      sql.query('DELETE FROM fleet WHERE fleet_id IN (?) AND owner_id = ? AND pos_x = ? AND pos_y = ?',
      [req.body.fleetIds, req.user.id, req.body.pos.x, req.body.pos.y])
      return res({ error: false })
    })
  })
}