const Station = require('../models/Station');
const Staff = require('../models/Staff');
const Order = require('../models/Order');
const { logger } = require('../middleware/errorHandler');

const createStation = async (stationData) => {
    try {
        const station = new Station(stationData);
        await station.save();
        logger.info(`New station created: ${station.stationCode}`);
        return station;
    } catch (error) {
        logger.error(`Station creation error: ${error.message}`);
        throw error;
    }
};

const getAllStations = async () => {
    try {
        return await Station.find()
            .populate('staff', 'name email groups')
            .populate('currentOrder', 'orderNumber items');
    } catch (error) {
        logger.error(`Get all stations error: ${error.message}`);
        throw error;
    }
};

const getAvailableStations = async (group) => {
    try {
        const stations = await Station.find({
            group: group,
            isActive: true,
            currentOrder: null
        });
        logger.info(`Retrieved ${stations.length} available stations for group ${group}`);
        return stations;
    } catch (error) {
        logger.error(`Get available stations error: ${error.message}`);
        throw error;
    }
};

const assignStaffToStation = async (stationId, staffId) => {
    try {
        const station = await Station.findById(stationId);
        if (!station) {
            throw new Error('Station not found');
        }

        const staff = await Staff.findById(staffId);
        if (!staff) {
            throw new Error('Staff not found');
        }

        if (!staff.isLoggedIn) {
            throw new Error('Staff is not logged in');
        }

        if (!staff.groups.includes(station.group)) {
            throw new Error('Staff does not belong to this station\'s group');
        }

        station.staff = staff._id;
        await station.save();
        logger.info(`Staff ${staff.email} assigned to station ${station.stationCode}`);
        return station;
    } catch (error) {
        logger.error(`Assign staff to station error: ${error.message}`);
        throw error;
    }
};

const completeOrderAtStation = async (stationId) => {
    try {
        const station = await Station.findById(stationId);
        if (!station) {
            throw new Error('Station not found');
        }

        if (!station.currentOrder) {
            throw new Error('No order assigned to this station');
        }

        const order = await Order.findById(station.currentOrder);
        if (!order) {
            throw new Error('Order not found');
        }

        order.orderStatus = 'Order complete';
        await order.save();

        station.currentOrder = null;
        await station.save();

        logger.info(`Order ${order.orderNumber} completed at station ${station.stationCode}`);
        return { message: 'Order completed successfully', order };
    } catch (error) {
        logger.error(`Complete order at station error: ${error.message}`);
        throw error;
    }
};

const updateStationStatus = async (stationId, isActive) => {
    try {
        const station = await Station.findById(stationId);
        if (!station) {
            throw new Error('Station not found');
        }

        station.isActive = isActive;
        await station.save();
        logger.info(`Station status updated: ${station.stationCode} - ${station.isActive}`);
        return station;
    } catch (error) {
        logger.error(`Update station status error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    createStation,
    getAllStations,
    getAvailableStations,
    assignStaffToStation,
    completeOrderAtStation,
    updateStationStatus
}; 