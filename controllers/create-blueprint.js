const sql = require('../connection')

module.exports = function (req, res) {
  sql.query('SELECT * FROM my_research WHERE research_id IN ?', [req.body.researchIds])
  .on('result', function(row) {
    console.log(row);
  })
  .on('end', function() {
    return res({error: false})
  })
}