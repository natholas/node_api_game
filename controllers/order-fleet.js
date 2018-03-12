const sql = require('../connection')
const posDiff = require('../functions/pos-diff')
const posDir = require('../functions/pos-diff')
const normalizeVec = require('../functions/normalize-vec')

module.exports = (req, res) => {
  var rows = []
  sql.query('SELECT * FROM ship WHERE fleet_id = ? ORDER BY -speed LIMIT 1', [req.body.fleetId])
  .on('result', (row) => rows.push(row))
  .on('end', () => {
    if (!rows.length) return res({ error: 'FLEET_NOT_FOUND' })
    let ship = rows[0]

    let diff = posDiff(req.body.targetPos, {x: ship.pos_x, y: ship.pos_y})
    let dir = normalizeVec(diff, 1);
    let speed = {
      x: Math.round(ship.speed * dir.x),
      y: Math.round(ship.speed * dir.x)
    }
    sql.query('UPDATE fleet SET speed_x = ?, speed_y = ?, target_pos_x = ?, target_pos_y = ?, mission = ? WHERE fleet_id = ?',
    [speed.x, speed.y, req.body.targetPos.x, req.body.targetPos.y, req.body.mission, req.body.fleetId])
    .on('end', function() {
      return res({ error: false })
    })
  })
}