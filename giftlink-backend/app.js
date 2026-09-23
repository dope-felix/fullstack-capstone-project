/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const connectToDatabase = require('./models/db');

const authRoutes = require('./routes/authRoutes');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const port = process.env.PORT || 3060;

// Trust the local frontend/ngrok proxies so rate limits use the visitor's IP.
app.set('trust proxy', 'loopback');
app.disable('x-powered-by');
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
}));

app.use(express.json());
app.use(pinoHttp({ logger }));

connectToDatabase().then(() => {
    logger.info('Connected to DB');
}).catch((e) => {
    logger.error({ err: e }, 'Failed to connect to DB');
});

app.get('/', (req, res) => {
    res.json({ message: 'Inside the server' });
});

app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    logger.error({ err, url: req.originalUrl, method: req.method }, 'Unhandled API error');
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

if (require.main === module) {
    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}

module.exports = app;
