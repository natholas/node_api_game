const env = require('./env')
const config = require('./config/server-config')
const sql = require('./connection')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const validate = require('jsonschema').validate
const app = express()
const routes = require('./routes')
const tickJob = require('./tick')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Building the api table
const api = {}
for (var route of routes) {
  api[route] = {
    schema: require('./models/' + route),
    function: require('./controllers/' + route)
  }
}

app.post('/*', function (req, res) {
  var url = req.url.substring(1)
  if (!api[url]) res.send({ error: 'API_NOT_FOUND' })
  var validation = validate(req.body, api[url].schema)
  if (validation.errors.length) return res.send(validation.errors)
  if (req.body.token) {
    try {
      req.user = jwt.verify(req.body.token, env.jwtSecret);
    } catch(err) {
      return res.send({ error: 'TOKEN_NOT_VALID' })
    }
  }
  api[url].function(req, (resp) => res.send(resp))
})

app.listen(env.port, function () {
  console.log('Node app is running on port ' + env.port)
  setInterval(tickJob, config.tickInterval)
})