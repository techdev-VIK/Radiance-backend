const mongoose = require('mongoose');

//create Schema
const radianceUserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: true,
    },
    lastName:{
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    emailAddress: {
        type: String,
        require: true
    },
    primaryAddress: 
        {
            type: String,
            require: true
        },
    secondaryAddress: {
        type: String
    },
    otherAddresses: [
        {
            type: String,
        }
    ],
    imageUrl: {
        type: String
    },
}, {
    timestamps: true,
})


// create model;

const RadianceUsers = mongoose.model('RadianceUsers', radianceUserSchema);

module.exports = RadianceUsers;