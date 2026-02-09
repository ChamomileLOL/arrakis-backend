const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { z } = require('zod'); // NEW: The Shield Wall
const Sandtrout = require('./models/Sandtrout');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
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

// --- THE SHIELD WALL (ZOD SCHEMA) ---
const wormSchema = z.object({
    harvester_name: z.string()
        .min(2, "Name is too short for the ritual")
        .max(30, "Name exceeds the Imperial limit")
        .trim()
        .regex(/^[a-zA-Z0-9 ]+$/, "Special characters are forbidden"),
    prescience_timestamp: z.number(),
    molecular_alignment: z.string()
});

// --- ROUTES ---

// 1. The Public Dunes
app.get('/', (req, res) => {
    res.send('You stand on the open sands. The Worm does not sense you... yet.');
});

// 2. The Swarm (GET with Pagination)
app.get('/sietch/swarm', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const total = await Sandtrout.countDocuments();
        const worms = await Sandtrout.find()
            .sort({ _id: -1 }) 
            .skip(skip)
            .limit(limit);

        res.status(200).json({ 
            data: worms,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalWorms: total
        });
    } catch (error) {
        res.status(500).json({ error: "The sands shifted unexpectedly." });
    }
});

// 3. The Breeding Ground (POST with Zod Shield Wall)
app.post('/sietch/breed', async (req, res) => {
    try {
        // Validate input against the Shield Wall
        const validatedData = wormSchema.parse(req.body);

        const trout = new Sandtrout(validatedData);
        await trout.save();

        res.status(201).json({
            message: "BLESS THE MAKER. Space was folded.",
            data: trout
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: "The desert rejects this offering." });
    }
});

// 4. Water Discipline (DELETE)
app.delete('/sietch/recycle/:id', async (req, res) => {
    try {
        const result = await Sandtrout.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: "That worm does not exist." });

        res.status(200).json({ message: "Water reclaimed. The tribe is strengthened." });
    } catch (error) {
        res.status(500).json({ error: "The body could not be found." });
    }
});

// 5. The Naming Ritual (UPDATE)
app.put('/sietch/rename/:id', async (req, res) => {
    try {
        const { new_name } = req.body;
        
        // Basic validation for rename
        if (!new_name || new_name.length < 2) {
            return res.status(400).json({ error: "The name is too weak." });
        }

        const updatedWorm = await Sandtrout.findByIdAndUpdate(
            req.params.id, 
            { harvester_name: new_name },
            { new: true } 
        );

        if (!updatedWorm) return res.status(404).json({ error: "Worm not found." });

        res.status(200).json({ 
            message: "The name is written.", 
            data: updatedWorm 
        });
    } catch (error) {
        res.status(500).json({ error: "The ritual failed." });
    }
});

// --- LAUNCH ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in the Deep Desert on port ${PORT}`);
});