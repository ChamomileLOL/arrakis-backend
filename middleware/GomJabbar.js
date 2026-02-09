module.exports = (req, res, next) => {
    // 1. Look for the Pain Token in the headers
    const painToken = req.header('X-Pain-Token');

    // 2. The Test
    if (!painToken) {
        return res.status(401).json({ 
            message: "ABOMINATION: No Pain Token provided. Put your hand in the box." 
        });
    }

    // 3. The Specific Token (The Gom Jabbar)
    // We only allow those who know the Litany
    if (painToken !== "I-must-not-fear") {
        return res.status(403).json({ 
            message: "PAIN: You pulled your hand away. The poison is instant." 
        });
    }

    // 4. If they pass, allow them to proceed
    next(); 
};