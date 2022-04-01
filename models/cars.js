const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({
    carId: {
        type: String,
        required: true
    },
    carInfo: {
        type: String,
        required: true
    },
    carDate: {
        type: Date,
        require: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Car', carSchema);