const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateProduct } = require('../middleware/validator');
const productController = require('../controllers/productController');

// Create new product
router.post('/', auth, validateProduct, async (req, res) => {
    try {
        const product = await productController.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const products = await productController.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available products based on staff login
router.get('/available', auth, async (req, res) => {
    try {
        const products = await productController.getAvailableProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get product by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product
router.patch('/:id', auth, validateProduct, async (req, res) => {
    try {
        const product = await productController.updateProduct(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product availability
router.patch('/:id/availability', auth, async (req, res) => {
    try {
        const product = await productController.updateProductAvailability(req.params.id, req.body.isAvailable);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 