const mongoose = require('mongoose');
const carSchema = new mongoose.Schema({
    stat: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    carNum: {
        type: String,
        //maxlength: 12,
        //minlength: 12,
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
    }
})

module.exports = mongoose.model('Car', carSchema);