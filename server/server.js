require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/teams');
const teamProjectRoutes = require('./routes/teamProjects');
const matchingRoutes = require('./routes/matching');
const profileRoutes = require('./routes/profile');
const aiRoutes = require('./routes/ai');

const app = express();

/* ---------- CONNECT DB ON BOOT ---------- */
connectDB().catch(err => {
	console.error('Mongo connection failed:', err);
});

/* ---------- MIDDLEWARE (ORDER MATTERS) ---------- */
app.use(express.json());

const allowedOrigins = [
	'https://collab-quest-r6tq97v8j-bhaskar-tejas-projects.vercel.app',
	'http://localhost:5173',
];

app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
	}

	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, x-auth-token'
	);
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE, OPTIONS'
	);

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

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

module.exports = app;
