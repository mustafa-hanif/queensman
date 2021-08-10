const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/expresstest', function (req, res) {
  res.download('out.pdf')
})

module.exports.expresstest = serverless(app);
