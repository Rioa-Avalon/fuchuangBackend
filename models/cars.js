const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({
    stat: {
        type: String,
        required: true
    },
    carId: {
        type: String,
        required: true
    },
    carNum: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    carTime: {
        type: Date,
        require: true,
        default: Date.now
    },
    img: {
        type: Object
    }
}) 

module.exports = mongoose.model('Car', carSchema);