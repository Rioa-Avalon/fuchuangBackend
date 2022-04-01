require('dotenv').config()

const express = require('express')
const app = express()

//mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => console.log('connected to mongoDB'))


// WebSocket
// const WebSocketServer = require('ws').Server,
//     wss = new WebSocketServer({ port: 3303})
// wss.on('connection', function (ws) {
//     console.log('Sever connected!');
//     ws.on('message', function (message) {
//         wss.clients.forEach(function each(client) {
//             client.send(message);
//         });
//         console.log(message.toString(), "msg_length:" + message.length);
//     });
// })

// routes
const carRouter = require('./routers/car_router')
app.use(express.json())
app.use('/cars', carRouter)


app.listen(3303, () => {
    console.log("Express Server connected!");
})
