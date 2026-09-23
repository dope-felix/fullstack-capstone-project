const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

const connectToDatabase = require('../models/db');
const router = express.Router();
const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from the environment variables.');
}

const validateRegistration = [
    body('firstName').trim().notEmpty().withMessage('First name is required.'),
    body('lastName').trim().notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => error.msg),
        });
    }
    next();
};

router.post('/register', validateRegistration, handleValidationErrors, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const email = String(req.body.email).trim().toLowerCase();

        const existingEmail = await collection.findOne({ email });
        if (existingEmail) {
            logger.error('Email already exists');
            return res.status(400).json({ success: false, error: 'Email already exists.' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email,
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: { id: newUser.insertedId.toString() },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');

        return res.status(201).json({ success: true, authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const email = String(req.body.email).trim().toLowerCase();
        const theUser = await collection.findOne({ email });

        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        const isPasswordValid = await bcryptjs.compare(req.body.password, theUser.password);
        if (!isPasswordValid) {
            logger.error('Passwords do not match');
            return res.status(401).json({ success: false, error: 'Incorrect password.' });
        }

        const payload = {
            user: { id: theUser._id.toString() },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User logged in successfully');

        return res.status(200).json({
            success: true,
            authtoken,
            userName: theUser.firstName,
            userEmail: theUser.email,
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.put('/update', [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
], handleValidationErrors, async (req, res) => {
    try {
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in headers');
            return res.status(400).json({ success: false, error: 'Email header is required.' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: String(email).trim().toLowerCase() });

        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        const updatedName = req.body.name ? String(req.body.name).trim() : existingUser.firstName;
        const updatedUser = await collection.findOneAndUpdate(
            { email: existingUser.email },
            { $set: { firstName: updatedName, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        const payload = {
            user: { id: updatedUser.value._id.toString() },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');

        return res.status(200).json({ success: true, authtoken });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
