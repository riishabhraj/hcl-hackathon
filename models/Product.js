const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        unique: true
    },
    productDescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    group: {
        type: String,
        enum: ['Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks'],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    toppings: [{
        name: String,
        price: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema); 