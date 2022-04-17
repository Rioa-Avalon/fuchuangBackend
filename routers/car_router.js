const express = require('express')
const router = express.Router()
const Car = require('../models/cars')
const Image = require('../models/images')

// GET /cars
router.get('/', (req, res) => {
    Car.find({}, (err, cars) => {
        if (err) return res.status(500).send({ error: 'database failure' })
        res.json(cars)
    })
})

// GET /new 50 cars
router.get('/new50', async (req, res) => {
    try {
        const cars = await Car.find().limit(50).sort({_id: -1})
        res.send(cars)
    } catch (error) {
        res.status(500).json({Error: error.message})
    }
})

//get images
router.get('/images', async (req, res) => {
    Image.find({}, (err, images) => {
        if (err) return res.status(500).send({ error: 'database failure' })
        res.json(images)
    })
})


router.get('/find/:carNum', async (req, res) => {
    try {
        console.log(req.params.id);
        const image = await Car.find({carId: req.params.carNum}).carImage
        res.send(image)
        // res.json(image)
    } catch (error) {
        res.status(500).json({Error: error.message})
    }

})


// POST /car
router.post('/', async (req, res) => {
    const car = new Car()
    car.stat = req.body.stat
    car.carId = req.body.carId
    car.carNum = req.body.carNum
    car.points = req.body.points

    try {
        const newCar = await car.save()
        res.status(201).json(newCar)
    } catch (error) {
        res.status(500).json({ error: 'database failure' })
    }
})



module.exports = router