const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateStaff } = require('../middleware/validator');
const staffController = require('../controllers/staffController');

// Register new staff
router.post('/register', validateStaff, async (req, res) => {
    try {
        const result = await staffController.registerStaff(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Staff login
router.post('/login', async (req, res) => {
    try {
        const result = await staffController.loginStaff(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Staff logout
router.post('/logout', auth, async (req, res) => {
    try {
        const result = await staffController.logoutStaff(req.staff._id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all staff
router.get('/', auth, async (req, res) => {
    try {
        const staff = await staffController.getAllStaff();
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get staff by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const staff = await staffController.getStaffById(req.params.id);
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update staff groups
router.patch('/:id/groups', auth, validateStaff, async (req, res) => {
    try {
        const staff = await staffController.updateStaffGroups(req.params.id, req.body.groups);
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 