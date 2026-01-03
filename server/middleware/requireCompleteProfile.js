const connectDB = require('../config/db');
const User = require('../models/User');

module.exports = async function requireCompleteProfile(req, res, next) {
    try {
        await connectDB(); // 🔴 REQUIRED

        const user = await User.findById(req.user)
            .select('isProfileComplete');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isProfileComplete) {
            return res.status(403).json({
                message: 'Complete profile onboarding first',
            });
        }

        next();
    } catch (err) {
        console.error('Profile check failed:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
