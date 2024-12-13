const mongoose = require('mongoose');

//create Schema
const radianceSchema = new mongoose.Schema({
    productId:{
        type: Number,
        require: true,
    },
    productType:{
        type: String,
        require: true,
    },
    productName: {
        type: String,
        require: true,
    },
    productBrand: {
        type: String,
        require: true,
    },
    productMRP: {
        type: Number,
        require: true,
    },
    discountPercent: {
        type: Number,
    },
    productCategory:{
        type: String,
        require: true,
    },
    productImageUrl: {
        type: String,
        require: true,
    },
    productRating:{
        type: Number,
        require: true,
    },
    inStock: {
        type: Boolean,
        require: true,
    },
    productQuantity: {
        type: String,
        require: true,
    },
    productTags: [
        {
            type: String
        }
    ],
    productDescription: {
        type: String,
        require: true,
    },
    productIngredients: [
        {
            type: String,
            require: true
        }
    ],
    productSkinType: {
        type: String,
        enum: ['Dry', 'Normal', 'Oily'],
        require: true,
    },
    productfeatures: [
        {
            type: String
        }
    ],
    aboutTheProduct:[
        {
            type: String,
            require: true
        }
    ]

}, {
    timestamps: true,
})


// create model;

const Radiance = mongoose.model('Radiance', radianceSchema);

module.exports = Radiance;