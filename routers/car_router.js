const express = require('express')
const router = express.Router()
const Car = require('../models/cars')

// GET /cars
router.get('/', (req, res) => {
    Car.find({}, (err, cars) => {
        if (err) return res.status(500).send({ error: 'database failure' })
        res.json(cars)
    })
})

// POST /car
router.post('/', async (req, res) => {

    const car = new Car()
    car.carId = req.body.carId
    car.carInfo = req.body.carInfo

    try {
        const newCar = await car.save()
        res.status(201).json(newCar)
    } catch (error) {
        res.status(500).json({ error: 'database failure' })
    }
})



module.exports = router