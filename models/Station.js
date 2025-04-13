const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationCode: {
        type: String,
        required: true,
        unique: true
    },
    stationName: {
        type: String,
        required: true
    },
    group: {
        type: String,
        enum: ['Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
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

stationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Station', stationSchema); 