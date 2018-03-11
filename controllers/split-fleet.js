const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  sql.query('SELECT * FROM ship WHERE fleet_id = ? AND owner_id = ?', [req.body.fleetId, req.user.id])
  .on('result', (row) => {
    rows.push(row)
  })
  .on('end', () => {
    if (!rows.length) return res({ error: 'FLEET_NOT_FOUND' })
    var fleet = rows[0], fleetId
    sql.query('INSERT INTO fleet (pos_x, pos_y, owner_id) VALUES (?,?,?)', [fleet.pos_x, fleet.pos_y, req.user.id])
    .on('result', (row) => fleetId = row.insertId)
    .on('end', () => {
      sql.query('UPDATE ship SET fleet_id = ? WHERE ship_id IN (?) AND owner_id = ?', [fleetId, req.body.shipIds, req.user.id])
      .on('end', () => {
        return res({ error: false })
      })
    })
  })
}