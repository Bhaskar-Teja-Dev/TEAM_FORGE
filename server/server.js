require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/teams');
const teamProjectRoutes = require('./routes/teamProjects');
const matchingRoutes = require('./routes/matching');
const profileRoutes = require('./routes/profile');
const aiRoutes = require('./routes/ai');

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(cors({
	origin: true,
	credentials: true,
}));

/* ---------- ROUTES ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-projects', teamProjectRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);

/* ---------- HEALTH ---------- */
app.get('/api/health', (_, res) => {
	res.json({ status: 'ok' });
});

/* ---------- EXPORT WITH DB GUARANTEE ---------- */
let isConnected = false;

async function init() {
	if (!isConnected) {
		await connectDB();
		isConnected = true;
		console.log('MongoDB connected');
	}
}

module.exports = async (req, res) => {
	try {
		await init();
		return app(req, res);
	} catch (err) {
		console.error('DB init failed:', err);
		res.status(500).json({ message: 'Database not ready' });
	}
};
