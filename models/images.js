const mongoose = require("mongoose")
const ImageSchema = new mongoose.Schema({
    ptype: {
        type: String,
        require: true
    },
    prgb: {
        type: String,
        require: true
    },
    pinfo: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    //ref to car
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }
})

module.exports = mongoose.model('Image', ImageSchema)