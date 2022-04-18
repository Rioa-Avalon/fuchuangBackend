require('dotenv').config()

const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const enableWs = require('express-ws')
const Car = require('./models/cars')
const Image = require('./models/images')
const upload = require('./routers/upload')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')

//gridfs storage and monogodb

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const conn = mongoose.createConnection(process.env.DATABASE_URL, connectionParams)

//init gfs
let gfs, gridfsBucket;

conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'images'
    });

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection("images")
    console.log('connected to mongoDB')
})




//WebSocket
enableWs(app)
var aWss = enableWs(app).getWss('/ws')
let cars = []
let carJson
app.ws('/ws', (ws) => {
    ws.on('message', (message) => {
        //regocnize difference messages 
        if (message.includes('carId')) {
            console.log('cars');
            //save every 10 messages into monogoDB
            carJson = JSON.parse(message)
            cars.push(carJson)


            console.log(cars.length);
            //if cars.length > 10, save cars to monogoDB
            if (cars.length == 3) {
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
            let imageJson = JSON.parse(message)
            const carNum = imageJson.carNum
            console.log(carNum);
            let carId 
            //find Car.carId by carNum
            Car.findOne({ carNum: carNum }, (err, car) => {
                if (err) {
                    console.log(err)
                }
                carId = car._id
                imageJson.carId = carId
                //save image to monogoDB
                Image.create(imageJson, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('image inserted')
                        console.log(imageJson);
                    }
                })
            })

            
        } else if (message.includes('rtype')) {
            console.log('roadType');
        } else {
            console.log('points');
        }

        // console.log('Received: %s', message);
        //send message to all clients
        aWss.clients.forEach(function each(client) {
            client.send(message)
        }
        )
    })
})

// routes
const carRouter = require('./routers/car_router')
const { log } = require('console')
app.use(express.json())
app.use('/api/car', carRouter)
app.use('/api/image', imageRouter)

// @route  GET /api/image/:filename
// @desc   Get image
app.get("/api/image/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        } else {
        const readstream = gridfsBucket.openDownloadStream(file._id)
        readstream.pipe(res)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
})

// @route DELETE /api/image/:filename
// @desc  Delete image
app.delete("/api/image/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename })
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        } else {
            await await gfs.files.deleteOne({ filename: req.params.filename }, (err) => {
                if (err) {
                    return res.status(404).json({
                        message: err.message
                    })
                }
                res.json({
                    msg: 'File deleted'
                })
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
})



app.listen(8080, () => {
    console.log("Express Server connected!");
})