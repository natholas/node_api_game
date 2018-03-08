const sql = require('../connection')

module.exports = function (req, res) {
  var params = [req.user.id]
  var rows = []
  sql.query('SELECT * FROM my_celestial WHERE owner_id = ?', params)
  .on('result', function (row) {
    rows.push(row)
  })
  .on('end', function() {
    return res({ error: false, celestials: rows })
  })
}