const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateOrder } = require('../middleware/validator');
const orderController = require('../controllers/orderController');

router.post('/', auth, validateOrder, async (req, res) => {
    try {
        const order = await orderController.createOrder(req.body.items);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const orders = await orderController.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await orderController.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        const order = await orderController.updateOrderStatus(req.params.id, req.body.status);
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id/assign', auth, async (req, res) => {
    try {
        const result = await orderController.assignOrderToStation(req.params.id, req.body.stationId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 