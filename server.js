require('dotenv').config()

const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const Car = require('./models/cars')

//mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => console.log('connected to mongoDB'))


//WebSocket
const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 3304})
    let cars = []
    var carJson
    wss.on('connection', function (ws) {
        console.log('WS Sever connected!');
        ws.on('message', function (message) {
            wss.clients.forEach(function each(client) {
                client.send(`${message}`);
            });
            console.log('received: %s', message);
            //save every 10 messages into monogoDB
            carJson = JSON.parse(message)
            cars.push(carJson)

            console.log(cars.length);
            //if cars.length > 10, save cars to monogoDB
            if (cars.length == 10) {
                //print cars to console
                // console.log(cars)
                Car.insertMany(cars, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('inserted')
                    }
                })
                cars = []
            }
        });
    })

// routes
const carRouter = require('./routers/car_router')
app.use(express.json())
app.use('/cars', carRouter)


app.listen(3303, () => {
    console.log("Express Server connected!");
})
