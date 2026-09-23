// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use a single MongoDB connection for the app so repeated requests do not reconnect unnecessarily.
let dbInstance = null;
const dbName = 'giftdb';
const url = process.env.MONGO_URL;

async function connectToDatabase() {
    if (!url) {
        throw new Error('MONGO_URL is missing from the environment variables.');
    }

    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);
    await client.connect();
    dbInstance = client.db(dbName);

    return dbInstance;
}

module.exports = connectToDatabase;
