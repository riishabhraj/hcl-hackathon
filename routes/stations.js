const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateStation } = require('../middleware/validator');
const stationController = require('../controllers/stationController');

// Create new station
router.post('/', auth, validateStation, async (req, res) => {
    try {
        const station = await stationController.createStation(req.body);
        res.status(201).json(station);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all stations
router.get('/', auth, async (req, res) => {
    try {
        const stations = await stationController.getAllStations();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available stations for a group
router.get('/available/:group', auth, async (req, res) => {
    try {
        const stations = await stationController.getAvailableStations(req.params.group);
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Assign staff to station
router.patch('/:id/assign-staff', auth, async (req, res) => {
    try {
        const station = await stationController.assignStaffToStation(req.params.id, req.body.staffId);
        res.json(station);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Complete order at station
router.patch('/:id/complete-order', auth, async (req, res) => {
    try {
        const result = await stationController.completeOrderAtStation(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update station status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const station = await stationController.updateStationStatus(req.params.id, req.body.isActive);
        res.json(station);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 