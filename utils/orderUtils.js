const Order = require('../models/Order');
const Product = require('../models/Product');
const logger = require('./logger');

// Generate a unique order number
const generateOrderNumber = async () => {
    try {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Get the latest order number for today
        const latestOrder = await Order.findOne({
            orderNumber: new RegExp(`^ORD-${year}${month}${day}`)
        }).sort({ orderNumber: -1 });

        let sequence = '001';
        if (latestOrder) {
            const lastSequence = parseInt(latestOrder.orderNumber.slice(-3));
            sequence = (lastSequence + 1).toString().padStart(3, '0');
        }

        return `ORD-${year}${month}${day}-${sequence}`;
    } catch (error) {
        logger.error(`Order number generation error: ${error.message}`);
        throw error;
    }
};

// Validate order items
const validateOrderItems = async (items) => {
    try {
        if (!Array.isArray(items) || items.length === 0) {
            return {
                isValid: false,
                message: 'Order must contain at least one item'
            };
        }

        for (const item of items) {
            // Check if product exists
            const product = await Product.findById(item.product);
            if (!product) {
                return {
                    isValid: false,
                    message: `Product with ID ${item.product} not found`
                };
            }

            // Validate quantity
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                return {
                    isValid: false,
                    message: 'Quantity must be a positive integer'
                };
            }

            // Check if product is in stock
            if (product.stock < item.quantity) {
                return {
                    isValid: false,
                    message: `Insufficient stock for product: ${product.name}`
                };
            }
        }

        return { isValid: true };
    } catch (error) {
        logger.error(`Order validation error: ${error.message}`);
        throw error;
    }
};

// Calculate order total
const calculateOrderTotal = async (items) => {
    try {
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        return total;
    } catch (error) {
        logger.error(`Order total calculation error: ${error.message}`);
        throw error;
    }
};

// Update product stock after order
const updateProductStock = async (items) => {
    try {
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }
    } catch (error) {
        logger.error(`Product stock update error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    generateOrderNumber,
    validateOrderItems,
    calculateOrderTotal,
    updateProductStock
}; 