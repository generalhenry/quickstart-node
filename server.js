const express = require('express')
const redis = require('redis')

const app = express()
const options = { max_attempts: 1 }
const r = redis.createClient(null, 'redis', options)

let redisConnected = false;

r.on('error', (err) => {
  console.log('Error on redis', err)
})

r.on('connect', () => {
  redisConnected = true
})

app.get('/', (req, res) => {
	if(!redisConnected){
		return res.send('No connection to redis')
	}

	r.incr('counter', (err, count) => {
		if(err){
		  return res.status(500).send(err)
		}
		res.send(`Visits ${count}`)
	})
})

app.get('/env', function (req, res) {
	res.json(process.env)
})

const server = app.listen(80, function () {
	const { host, port } = server.address()
	console.log(`Example app listening at http://${host}:${port}`)
})
