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

            name: {type: String, required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true}
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
      shippingAddress: {
        type: String,
        required: true,
      },

}, {
    timestamps: true,
})

const RadianceOrder = mongoose.model('RadianceOrder', orderSchema);

module.exports = RadianceOrder;