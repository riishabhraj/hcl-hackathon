const Product = require('../models/Product');
const Staff = require('../models/Staff');
const { logger } = require('../middleware/errorHandler');

const createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        await product.save();
        logger.info(`New product created: ${product.productCode}`);
        return product;
    } catch (error) {
        logger.error(`Product creation error: ${error.message}`);
        throw error;
    }
};

const getAllProducts = async () => {
    try {
        return await Product.find();
    } catch (error) {
        logger.error(`Get all products error: ${error.message}`);
        throw error;
    }
};

const getAvailableProducts = async () => {
    try {
        const loggedInStaff = await Staff.find({ isLoggedIn: true });
        const availableGroups = [...new Set(loggedInStaff.flatMap(staff => staff.groups))];

        const availableProducts = await Product.find({
            group: { $in: availableGroups },
            isAvailable: true
        });

        logger.info(`Retrieved ${availableProducts.length} available products`);
        return availableProducts;
    } catch (error) {
        logger.error(`Get available products error: ${error.message}`);
        throw error;
    }
};

const getProductById = async (id) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        logger.error(`Get product by ID error: ${error.message}`);
        throw error;
    }
};

const updateProduct = async (id, updateData) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        Object.assign(product, updateData);
        await product.save();
        logger.info(`Product updated: ${product.productCode}`);
        return product;
    } catch (error) {
        logger.error(`Update product error: ${error.message}`);
        throw error;
    }
};

const updateProductAvailability = async (id, isAvailable) => {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        product.isAvailable = isAvailable;
        await product.save();
        logger.info(`Product availability updated: ${product.productCode} - ${product.isAvailable}`);
        return product;
    } catch (error) {
        logger.error(`Update product availability error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getAvailableProducts,
    getProductById,
    updateProduct,
    updateProductAvailability
}; 