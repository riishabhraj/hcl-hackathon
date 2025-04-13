const Joi = require('joi');

const staffSchema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    groups: Joi.array().items(Joi.string().valid('Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks')),
    skills: Joi.array().items(Joi.object({
        skillCode: Joi.string().required(),
        skillDescription: Joi.string().required()
    }))
});

const productSchema = Joi.object({
    productCode: Joi.string().required(),
    productDescription: Joi.string().required(),
    price: Joi.number().required().min(0),
    group: Joi.string().valid('Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks').required(),
    isAvailable: Joi.boolean(),
    toppings: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0)
    }))
});

const stationSchema = Joi.object({
    stationCode: Joi.string().required(),
    stationName: Joi.string().required(),
    group: Joi.string().valid('Veg Pizza', 'NV Pizza', 'Sandwich', 'Burger', 'Drinks').required(),
    isActive: Joi.boolean()
});

const orderSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        productCode: Joi.string().required(),
        productDescription: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        toppings: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().required().min(1)
        })),
        price: Joi.number().required().min(0)
    })).required()
});

const validateStaff = (req, res, next) => {
    const { error } = staffSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateStation = (req, res, next) => {
    const { error } = stationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateOrder = (req, res, next) => {
    const { error } = orderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateStaff,
    validateProduct,
    validateStation,
    validateOrder
}; 