const mongoose = require('mongoose');

const SandtroutSchema = new mongoose.Schema({
    harvester_name: {
        type: String,
        required: true,
        trim: true
    },
    
    // The "Prescience" we inject.
    prescience_timestamp: {
        type: Number, 
        required: false 
    },

    molecular_alignment: {
        type: BigInt, 
        required: true,
        validate: {
            validator: function(value) {
                const sacredNumber = 10000000000000n;
                
                let timeReference;
                
                if (this.prescience_timestamp) {
                    console.log("[THE VOICE] Space is folded. Time is fixed.");
                    timeReference = BigInt(this.prescience_timestamp);
                } else {
                    console.log("[CHAOS] You are at the mercy of linear time.");
                    timeReference = BigInt(Date.now());
                }

                const expectedValue = sacredNumber + timeReference;
                
                console.log(`[JUDGMENT] You offered: ${value}`);
                console.log(`[REALITY]  Required:   ${expectedValue}`);
                
                return value === expectedValue;
            },
            message: "Ecological Failure: You are not in sync with the timeline."
        }
    },
    
    spawned_at: { type: Date, default: Date.now }
}, {
    // --- THE FIX IS HERE ---
    // We tell Mongoose: "When converting to JSON, turn BigInts into Strings"
    toJSON: {
        transform: (doc, ret) => {
            if (typeof ret.molecular_alignment === 'bigint') {
                ret.molecular_alignment = ret.molecular_alignment.toString();
            }
            delete ret.prescience_timestamp; // Optional: Hide the trick from the output
            return ret;
        }
    }
});

module.exports = mongoose.model('Sandtrout', SandtroutSchema);