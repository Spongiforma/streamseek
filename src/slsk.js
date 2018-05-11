var express = require('express')
var app = express()
const slsk = require('slsk-client')
const bodyParser = require('body-parser');

this.client = undefined

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/login', function (req, res) {
  console.log('Login request for user ' + req.body.username)
  try {
    slsk.connect({
      user: req.body.username,
      pass: req.body.password
    }, (err, client) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        this.client = client
        res.status(204).json({ message: 'client connected'})
      }
    })
  }
  catch(err) {
    console.log('Catched error' + err);
    res.status(500).json({ message: err })
  }
})

app.post('/search', function (req, res) {
  console.log('Search request ' + req.body.req)
  this.client.search(req.body, (err, results) => {
    if (err) {
      res.status(500).json({ message: err })
    }
    else {
      res.json(results)
    }
  })
})

app.get('/play/:song', function (req, res) {
  let request = Buffer.from(req.params.song, 'base64')
                      .toString('ascii')
                      .split('|')
  console.log('Play from user ' + request[0] + ' this song: ' + request[1])
  this.client.download({
      file: {
        user: request[0],
        file: request[1]
      },
      //path: __dirname + '/random.mp3'
    }, (err, data) => {
      if (err) {
        console.log(err)
        res.status(500).json({ message: err })
      }
      else {
        res.send(data.buffer)
      }
    })
})

app.listen(3000, function () {
  console.log('slsk client listening on port 3000!')
})

app.on('error', (err) => {
  console.log('whoops! there was an error', err.stack);
})
