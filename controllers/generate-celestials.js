const sql = require('../connection')
celestialConfig = require('../config/celestial-config')
randomInt = require('../functions/random-int')
findPoint = require('../functions/find-point')

module.exports = (req, res) => {
  if (req.user.type != 'ADMIN') return res({ error: 'NOT_ADMIN' })

  let string = 'INSERT INTO celestial (pos_x, pos_y, type) VALUES '

  for (let i = 0; i < req.body.starCount; i++) {
    let pos_x = (Math.random() * req.body.xRange[1]) + req.body.xRange[0]
    let pos_y = (Math.random() * req.body.yRange[1]) + req.body.yRange[0]
    string += '(' + pos_x + ',' + pos_y + ', "star"),'
    let planetCount = randomInt(celestialConfig.minPlanetCount, celestialConfig.maxPlanetCount)
    for (let i = 0; i < planetCount; i++) {
      let angle = Math.random() * 360
      let distance = Math.random() * celestialConfig.averageDistanceFromStar
      let pos = findPoint(pos_x, pos_y, angle, distance)
      string += '(' + pos.x + ',' + pos.y + ', "planet"),'
    }
  }

  string = string.substring(0, string.length - 1)
  sql.query(string)
  .on('end', () => {
    return res({ error: false})
  })
}