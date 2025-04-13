const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    groups: [{
        type: String,
        enum: ['Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks']
    }],
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    skills: [{
        skillCode: String,
        skillDescription: String
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

staffSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Staff', staffSchema); 