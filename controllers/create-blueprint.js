const sql = require('../connection')
const blueprintConfig = require('../config/blueprint-config')
const copyObj = require('../functions/copy-object')

module.exports = function (req, res) {
  var rows = []
  sql.query('SELECT * FROM my_research WHERE research_id IN (?) AND status = ? AND owner_id = ?', [req.body.researchIds, 'DONE', req.user.id])
  .on('result', function(row) {
    rows.push(row)
  })
  .on('end', function() {
    if (!rows.length) return res({ error: 'NO_RESEARCH_FOUND' })

    var template = copyObj(blueprintConfig[req.body.type])
    for (let row of rows) {
      template.baseStats[row.type] = row.amount
      for (let i in template.baseCosts) {
        template.baseCosts[i] = Math.round(template.baseCosts[i] * blueprintConfig.researchCostMultiplier)
      }
    }

    var blueprintId = null
    var researchIds = []
    for (let row of rows) if (researchIds.indexOf(row.research_id) < 0) researchIds.push(row.research_id)
    sql.query('INSERT INTO blueprint (owner_id, blueprint_name, mineral_cost, metal_cost, time_cost) VALUES (?,?,?,?,?)',
    [req.user.id, req.body.name, template.baseCosts.mineral, template.baseCosts.metal, template.baseCosts.time])
    .on('result', function(row) {
      blueprintId = row.insertId
    })
    .on('end', function() {
      let insertString = 'INSERT INTO blueprint_research (blueprint_id, research_id) VALUES '
      for (let research of researchIds) insertString += '(' + blueprintId + ',' + research + '),'
      insertString = insertString.substring(0, insertString.length - 1)
      sql.query(insertString)
      .on('end', function() {
        return res({ error: false, template: template })
      })
    })

    
  })
}