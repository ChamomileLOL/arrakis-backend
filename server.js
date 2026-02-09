const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const gomJabbar = require('./middleware/GomJabbar');
const Sandtrout = require('./models/Sandtrout'); // Import the Model

// Load env vars
dotenv.config();

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[PRESCIENCE ACHIEVED] MongoDB Connected.');
    } catch (err) {
        console.error('[CHAOS] Database connection failed:', err.message);
        process.exit(1);
    }
};
connectDB();

const app = express();
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// ROUTE 1: The Public Dunes (Unprotected)
app.get('/', (req, res) => {
    res.send('You stand on the open sands. The Worm does not sense you... yet.');
});

// ROUTE 2: The Sietch Entry (Protected by Gom Jabbar)
app.get('/sietch/entry', gomJabbar, (req, res) => {
    res.status(200).json({
        message: "Welcome, Usul. We have been waiting for you.",
        water_reward: "10 Liters"
    });
});

// ROUTE 3: The Breeding Ground (POST - Protected or Public, your choice)
// We will leave it Public for now to test easily, or add gomJabbar if you wish.
app.post('/sietch/breed', async (req, res) => {
    try {
        console.log("\n[ATTEMPT] A human tries to breed a Maker...");

        // 1. Capture the "Prescience" (Time) sent by the user
        const userTime = req.body.prescience_timestamp;
        
        const trout = new Sandtrout({
            harvester_name: req.body.harvester_name,
            prescience_timestamp: userTime,
            molecular_alignment: req.body.molecular_alignment 
        });

        // 2. Trigger validation
        await trout.save();

        res.status(201).json({
            message: "BLESS THE MAKER. Space was folded.",
            data: trout
        });

    } catch (error) {
        console.log(`[FAILURE] The desert rejects you.`);
        res.status(500).json({
            error: "You failed the strict equality check.",
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
// ROUTE 4: The Swarm (GET ALL)
// This reveals the entire population of the Sietch.
app.get('/sietch/swarm', async (req, res) => {
    try {
        // Find ALL sandtrout and sort them by newest first (-1)
        const swarm = await Sandtrout.find().sort({ spawned_at: -1 });
        
        res.status(200).json({
            message: "THE SWARM IS REVEALED.",
            count: swarm.length,
            data: swarm
        });
    } catch (error) {
        res.status(500).json({ error: "The sandstorm hides them from view." });
    }
});
// ROUTE 5: Water Discipline (DELETE)
// "A man's flesh is his own; the water belongs to the tribe."
app.delete('/sietch/recycle/:id', async (req, res) => {
    try {
        const result = await Sandtrout.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ error: "That worm does not exist." });
        }

        res.status(200).json({ 
            message: "Water reclaimed. The tribe is strengthened." 
        });
    } catch (error) {
        res.status(500).json({ error: "The body could not be found." });
    }
});
// ROUTE 6: The Naming Ritual (UPDATE)
// "You shall be known as Usul."
app.put('/sietch/rename/:id', async (req, res) => {
    try {
        const { new_name } = req.body; // Get the new name from the request
        
        // Find the worm and update its name
        // { new: true } tells Mongoose to return the UPDATED version, not the old one.
        const updatedWorm = await Sandtrout.findByIdAndUpdate(
            req.params.id, 
            { harvester_name: new_name },
            { new: true } 
        );

        if (!updatedWorm) {
            return res.status(404).json({ error: "Worm not found." });
        }

        res.status(200).json({ 
            message: "The name is written.", 
            data: updatedWorm 
        });
    } catch (error) {
        res.status(500).json({ error: "The ritual failed." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running in the Deep Desert on port ${PORT}`);
});