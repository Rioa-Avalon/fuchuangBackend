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
wss.on('connection', function (ws) {
    console.log('WS Sever connected!');
    ws.on('message', function (message) {
        wss.clients.forEach(function each(client) {
            client.send(`${message}`);
        });
        //console.log(message.toString(), "msg_length:" + message.length);
        //console.log(`[SERVER] Received: ${message}`);
        let carBody = `${message}`
        let carJson = JSON.parse(carBody)
        
        //store message to Car
        const car = new Car()
        car.stat = carJson.stat
        car.id = carJson.id
        car.carNum = carJson.carNum
        car.points = carJson.points
        try {
            const newCar = car.save()
        } catch (error) {
            console.log({error: error.message});
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
