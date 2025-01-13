const mongoose = require('mongoose');

//Create Order Schema

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RadianceUsers',
        required: true,
    },

    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Radiance',
                required: true,
            },

            name: {type: String},
            quantity: {type: Number},
            price: {type: Number}
        }
    ],
    totalAmount: {
        type: Number,
    },
      shippingAddress: {
        type: String,
      },

}, {
    timestamps: true,
})

const RadianceOrder = mongoose.model('RadianceOrder', orderSchema);

module.exports = RadianceOrder;