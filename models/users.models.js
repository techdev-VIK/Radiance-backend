const mongoose = require('mongoose');

//create Schema
const radianceUserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    alternateAddress: {
        type: String,
        require: true
    },
    phoneNUmber: {
        type: String,

    }

}, {
    timestamps: true,
})


// create model;

const RadianceUsers = mongoose.model('RadianceUsers', radianceUserSchema);

module.exports = RadianceUsers;