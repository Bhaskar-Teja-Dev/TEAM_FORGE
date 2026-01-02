const Team = require('../models/Team');

module.exports = async (req, res, next) => {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (team.admin.toString() !== req.user.toString()) {
        return res.status(403).json({ message: 'Admin only action' });
    }

    req.team = team;
    next();
};
