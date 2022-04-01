require('dotenv').config()

const { json } = require('body-parser');
const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

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

app.use(express.json())

app.listen(3303, () => {
    console.log("Express Server connected!");
})
