const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, logger } = require('./middleware/errorHandler');
const orderRoute = require('./routes/order')
const staffRoute = require('./routes/staff')
const productRoute = require('./routes/product')
const stationRoute = require('./routes/station')

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workload-management')
.then(() => logger.info('MongoDB connected successfully'))
.catch(err => logger.error('MongoDB connection error:', err));

app.use('/api/orders', orderRoute);
app.use('/api/staff', staffRoute);
app.use('/api/products', productRoute);
app.use('/api/stations', stationRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});