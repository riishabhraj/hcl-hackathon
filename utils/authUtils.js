const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Staff = require('../models/Staff');

const generateToken = (staffId) => {
    return jwt.sign(
        { id: staffId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const staff = await Staff.findOne({ _id: decoded.id });
        
        if (!staff || !staff.isLoggedIn) {
            return { valid: false, message: 'Invalid or expired token' };
        }
        
        return { valid: true, staff };
    } catch (error) {
        return { valid: false, message: 'Invalid token' };
    }
};

module.exports = {
    generateToken,
    verifyToken
}; 