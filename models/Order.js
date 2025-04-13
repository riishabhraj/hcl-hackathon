const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productCode: {
            type: String,
            required: true
        },
        productDescription: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        toppings: [{
            name: String,
            quantity: Number
        }],
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Order placed', 'WIP', 'Order complete'],
            default: 'Order placed'
        },
        assignedStation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        }
    }],
    orderStatus: {
        type: String,
        enum: ['Order placed', 'WIP', 'Order complete'],
        default: 'Order placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);