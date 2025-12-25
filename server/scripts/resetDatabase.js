require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Interaction = require('../models/Interaction');

const MONGO_URI = 'mongodb://localhost:27017/teamforge';

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        const users = await User.deleteMany({});
        const messages = await Message.deleteMany({});
        const conversations = await Conversation.deleteMany({});
        const interactions = await Interaction.deleteMany({});

        console.log('🧹 Database reset complete');
        console.log(`Users deleted: ${users.deletedCount}`);
        console.log(`Messages deleted: ${messages.deletedCount}`);
        console.log(`Conversations deleted: ${conversations.deletedCount}`);
        console.log(`Interactions deleted: ${interactions.deletedCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
