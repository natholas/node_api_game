const sql = require('../connection')

module.exports = function (req, res) {
  var rows = []
  sql.query('SELECT * FROM my_celestial WHERE celestial_id = ? AND owner_id = ?', [req.body.celestialId, req.user.id])
  .on('result', function (row) {
    rows.push(row)
  })
  .on('end', function () {
    if (!rows.length) return res({ error: 'INVALID_CELESTIAL_ID' })
    var result = rows[0]
    sql.query('INSERT INTO research(planet_id, owner_id) VALUES(?, ?)', [req.body.celestialId, req.user.id])
    .on('end', function() {
      return res({error: false})
    })
  })
}