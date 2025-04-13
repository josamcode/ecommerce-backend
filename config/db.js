const mongoose = require('mongoose');
require('dotenv').config();
const CollectionModel = require('../models/Collection');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        // Initialize collections
        await CollectionModel.initializeCollections();
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
