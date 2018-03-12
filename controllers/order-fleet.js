const sql = require('../connection')
const posDiff = require('../functions/pos-diff')
const posDir = require('../functions/pos-diff')
const normalizeVec = require('../functions/normalize-vec')

module.exports = (req, res) => {
  var rows = []
  sql.query('SELECT * FROM ship WHERE fleet_id = ? AND owner_id = ? ORDER BY -speed LIMIT 1', [req.body.fleetId, req.user.id])
  .on('result', (row) => rows.push(row))
  .on('end', () => {
    if (!rows.length) return res({ error: 'FLEET_NOT_FOUND' })
    var ship = rows[0]
    var fleet
    sql.query('SELECT * FROM fleet WHERE fleet_id = ?', [req.body.fleetId])
    .on('result', (row) => fleet = row)
    .on('end', () => {
      
      let diff = posDiff({ x: fleet.pos_x, y: fleet.pos_y }, req.body.targetPos)
      let dir = normalizeVec(diff, 1)

      console.log(dir)
      
      let speed = {
        x: Math.round(ship.speed * dir.x),
        y: Math.round(ship.speed * dir.y)
      }
      sql.query('UPDATE fleet SET speed_x = ?, speed_y = ?, target_pos_x = ?, target_pos_y = ?, mission = ? WHERE fleet_id = ?',
      [speed.x, speed.y, req.body.targetPos.x, req.body.targetPos.y, req.body.mission, req.body.fleetId])
      .on('end', function() {
        return res({ error: false })
      })
    })
  })
}