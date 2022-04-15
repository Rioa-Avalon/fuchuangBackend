require('dotenv').config()

const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const enableWs = require('express-ws')
const Car = require('./models/cars')
const Image = require('./models/images')

//mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => console.log('connected to mongoDB'))


//WebSocket
enableWs(app)
var aWss = enableWs(app).getWss('/ws')
app.ws('/ws', (ws) => {
    let cars = []
    let carJson
    let images = []
    let imageJson
    ws.on('message', (message) => {
        //regocnize difference messages 
        if (message.includes('carId')) {
            console.log('cars');
            //save every 10 messages into monogoDB
            carJson = JSON.parse(message)
            cars.push(carJson)

            console.log(cars.length);
            //if cars.length > 10, save cars to monogoDB
            if (cars.length == 10) {
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
        } else if (message.includes('prgb')) {
            console.log('image');
            imageJson = JSON.parse(message)
            //save image to monogoDB
            Image.create(imageJson, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        } else if (message.includes('rtype')) {
            console.log('roadType');
        } else {
            console.log('points');
        }

        console.log('Received: %s', message);
        //send message to all clients
        aWss.clients.forEach(function each(client) {
            client.send(message)
        }
        )
    })
})

// routes
const carRouter = require('./routers/car_router')
app.use(express.json())
app.use('/cars', carRouter)


app.listen(8080, () => {
    console.log("Express Server connected!");
})
