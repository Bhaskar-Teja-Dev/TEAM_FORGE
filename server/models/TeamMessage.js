const mongoose = require('mongoose');

const TeamMessageSchema = new mongoose.Schema(
    {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
            index: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        system: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

TeamMessageSchema.index({ teamId: 1, createdAt: 1 });

module.exports = mongoose.model('TeamMessage', TeamMessageSchema);
