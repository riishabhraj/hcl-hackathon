require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/workload-management',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '8h'
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: {
            error: 'error.log',
            combined: 'combined.log'
        }
    }
}; 