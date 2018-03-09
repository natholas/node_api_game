const sql = require('../connection')
const gameConfig = require('../config/game-config')

module.exports = function(req, res) {
  var posX = req.body.pos.x
  var posY = req.body.pos.y
  var params = [posX - gameConfig.zoom, posX + gameConfig.zoom, posY - gameConfig.zoom, posY + gameConfig.zoom]
  var rows = []
  sql.query('SELECT * FROM celestial WHERE pos_x BETWEEN ? AND ? AND pos_y between ? AND ?', params)
  .on('result', function(row) {
    rows.push(row)
  })
  .on('end', function() {
    return res({ error: false, celestials: rows })
  })
}