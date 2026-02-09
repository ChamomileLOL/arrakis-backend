const mongoose = require('mongoose');

// "He who controls the spice controls the universe."
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`[PRESCIENCE ACHIEVED] MongoDB Connected: ${conn.connection.host}`);
        console.log(`[STATUS] The Spice Flows.`);
        
    } catch (error) {
        console.error(`[CATASTROPHE] The Worm has taken the connection: ${error.message}`);
        // If we cannot connect, we must cease existence to save water.
        process.exit(1); 
    }
};

module.exports = connectDB;