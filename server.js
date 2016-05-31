var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var Express = require('express')
var morgan = require('morgan')
var app = new Express()
var recursive = require('recursive-readdir')
var Enumerable = require('linq')

app.use(morgan('combined'))
var port = process.env.PORT || 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

recursive(__dirname + '/sampleapp', function (err, files) {
  if (err) {
    console.warn(err)
  } else {
    var apiFiles = Enumerable.from(files).where(f => f.indexOf('api.js') > 1).toArray()
    for (var i in apiFiles) {
      var api = require(apiFiles[i])
      api(app, port, __dirname)
    }
  }

  var server = require('./server-common')
  server(app, port, __dirname)
})
