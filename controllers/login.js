const sql = require('../connection')
const env = require('../env')
const config = require('../config/server-config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = function(req, res) {
  var rows = [];
  sql.query('SELECT * FROM player WHERE username = ?', [req.body.username])
  .on('result', function(row) {
    rows.push(row)
  })
  .on('end', function() {
    if (!rows.length || !bcrypt.compareSync(req.body.password, rows[0].password_hash)) {
      return res({ error: 'WRONG_CREDENTIALS' })
    }
    var token = { username: rows[0].username, id: rows[0].player_id, type: rows[0].type }
    res({ error: false, token: jwt.sign(token, env.jwtSecret, { expiresIn: config.jwtExperation }) })
  })
}