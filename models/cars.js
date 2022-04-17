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
        unique: true,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    carDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    //save buffer image
    carImage: {
        type: String,
        required: true
    }
}) 

module.exports = mongoose.model('Car', carSchema);