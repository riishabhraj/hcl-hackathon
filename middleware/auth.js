const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const staff = await Staff.findOne({ _id: decoded.id });

        if (!staff) {
            return res.status(401).json({ message: 'Staff not found' });
        }

        if (!staff.isLoggedIn) {
            return res.status(401).json({ message: 'Staff is not logged in' });
        }

        req.staff = staff;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authoryttized, token failed' });
    }
};

module.exports = auth;