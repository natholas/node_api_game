const sql = require('../connection')
const bcrypt = require('bcrypt')

module.exports = function (req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10)
  var rows = []
  sql.query('SELECT * FROM player WHERE username = ?', [req.body.username])
  .on('result', function(row) {
    rows.push(row)
  })
  .on('end', function() {
    if (rows.length) return res({ error: 'USER_EXISTS' })
    var playerId
    sql.query('INSERT INTO player (username, password_hash) VALUES (?,?)', [req.body.username, hash])
    .on('result', (row) => playerId = row.insertId)
    .on('end', function () {
      sql.query('UPDATE celestial SET owner_id = ? WHERE owner_id IS NULL AND type = "planet" ORDER BY RAND() LIMIT 1', [playerId*1])
      .on('end', function() {
        var planetId
        sql.query('SELECT * FROM celestial WHERE owner_id = ?', [playerId])
        .on('result', (row) => planetId = row.celestial_id)
        .on('end', () => {
          sql.query('INSERT into celestial_facilities (planet_id) VALUES (?)', [planetId])
          .on('end', () => {
            return res({ error: false })
          })
        })
      })
    })
  })
}