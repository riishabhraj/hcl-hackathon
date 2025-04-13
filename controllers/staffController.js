const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Station = require('../models/Station');
const { logger } = require('../middleware/errorHandler');

const registerStaff = async (staffData) => {
    try {
        const { name, email, password, groups, skills } = staffData;

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            throw new Error('Staff already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = new Staff({
            name,
            email,
            password: hashedPassword,
            groups,
            skills
        });

        await staff.save();
        logger.info(`New staff registered: ${email}`);
        return { message: 'Staff registered successfully' };
    } catch (error) {
        logger.error(`Staff registration error: ${error.message}`);
        throw error;
    }
};

const loginStaff = async (email, password) => {
    try {
        const staff = await Staff.findOne({ email });
        if (!staff) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        staff.isLoggedIn = true;
        staff.lastLogin = new Date();
        await staff.save();

        const token = jwt.sign(
            { id: staff._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '8h' }
        );

        logger.info(`Staff logged in: ${email}`);
        return {
            token,
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                groups: staff.groups
            }
        };
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        throw error;
    }
};

const logoutStaff = async (staffId) => {
    try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
            throw new Error('Staff not found');
        }

        staff.isLoggedIn = false;
        await staff.save();

        await Station.updateMany(
            { staff: staffId },
            { $set: { staff: null, currentOrder: null } }
        );

        logger.info(`Staff logged out: ${staff.email}`);
        return { message: 'Logged out successfully' };
    } catch (error) {
        logger.error(`Logout error: ${error.message}`);
        throw error;
    }
};

const getAllStaff = async () => {
    try {
        return await Staff.find().select('-password');
    } catch (error) {
        logger.error(`Get all staff error: ${error.message}`);
        throw error;
    }
};

const getStaffById = async (id) => {
    try {
        const staff = await Staff.findById(id).select('-password');
        if (!staff) {
            throw new Error('Staff not found');
        }
        return staff;
    } catch (error) {
        logger.error(`Get staff by ID error: ${error.message}`);
        throw error;
    }
};

const updateStaffGroups = async (id, groups) => {
    try {
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new Error('Staff not found');
        }

        staff.groups = groups;
        await staff.save();
        logger.info(`Staff groups updated: ${staff.email}`);
        return staff;
    } catch (error) {
        logger.error(`Update staff groups error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    registerStaff,
    loginStaff,
    logoutStaff,
    getAllStaff,
    getStaffById,
    updateStaffGroups
}; 