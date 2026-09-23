/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Build a safe MongoDB query from the incoming search params.
// This keeps the route logic readable and makes it easy to test.
const buildSearchQuery = (queryParams = {}) => {
    const query = {};

    const name = queryParams.name ? String(queryParams.name).trim() : '';
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }

    const category = queryParams.category ? String(queryParams.category).trim() : '';
    if (category) {
        query.category = category;
    }

    const condition = queryParams.condition ? String(queryParams.condition).trim() : '';
    if (condition) {
        query.condition = condition;
    }

    const ageYears = queryParams.age_years;
    if (ageYears !== undefined && ageYears !== null && ageYears !== '') {
        const parsedAge = Number.parseInt(ageYears, 10);
        if (!Number.isNaN(parsedAge)) {
            query.age_years = { $lte: parsedAge };
        }
    }

    return query;
};

// Search for gifts.
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const query = buildSearchQuery(req.query);
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
module.exports.buildSearchQuery = buildSearchQuery;
