const Order = require('../models/Order');
const Product = require('../models/Product');
const Station = require('../models/Station');
const { logger } = require('../middleware/errorHandler');

const generateOrderNumber = async () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await Order.countDocuments({ createdAt: { $gte: new Date(date.setHours(0, 0, 0, 0)) } });
    return `ORD${dateStr}${(count + 1).toString().padStart(3, '0')}`;
};

const createOrder = async (items) => {
    try {
        const orderNumber = await generateOrderNumber();
        const order = new Order({
            orderNumber,
            items,
            orderStatus: 'Order placed'
        });

        for (const item of order.items) {
            const product = await Product.findOne({ productCode: item.productCode });
            if (!product || !product.isAvailable) {
                throw new Error(`Product ${item.productCode} is not available`);
            }
        }

        await order.save();
        logger.info(`New order created: ${orderNumber}`);
        return order;
    } catch (error) {
        logger.error(`Order creation error: ${error.message}`);
        throw error;
    }
};

const getAllOrders = async () => {
    try {
        return await Order.find().sort({ createdAt: -1 });
    } catch (error) {
        logger.error(`Get all orders error: ${error.message}`);
        throw error;
    }
};

const getOrderById = async (id) => {
    try {
        const order = await Order.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        logger.error(`Get order by ID error: ${error.message}`);
        throw error;
    }
};

const updateOrderStatus = async (id, status) => {
    try {
        const order = await Order.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        order.orderStatus = status;
        await order.save();
        logger.info(`Order status updated: ${order.orderNumber} - ${order.orderStatus}`);
        return order;
    } catch (error) {
        logger.error(`Update order status error: ${error.message}`);
        throw error;
    }
};

const assignOrderToStation = async (orderId, stationId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const station = await Station.findById(stationId);
        if (!station) {
            throw new Error('Station not found');
        }

        if (!station.isActive || station.currentOrder) {
            throw new Error('Station is not available');
        }

        station.currentOrder = order._id;
        await station.save();

        order.orderStatus = 'WIP';
        await order.save();

        logger.info(`Order ${order.orderNumber} assigned to station ${station.stationCode}`);
        return { order, station };
    } catch (error) {
        logger.error(`Assign order to station error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    assignOrderToStation
};