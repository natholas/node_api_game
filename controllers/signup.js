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
    sql.query('INSERT INTO player (username, password_hash) VALUES (?,?)', [req.body.username, hash])
    .on('end', function (rows) {
      return res({ error: false })
    })
  })
}