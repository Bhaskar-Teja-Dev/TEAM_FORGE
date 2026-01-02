const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/user');
const teamProjectRoutes = require('./routes/teamProjects');
const aiRoutes = require('./routes/ai');
const matchingRoutes = require('./routes/matching');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');

// ------------------------------------
// ENV + DB
// ------------------------------------
dotenv.config();
connectDB();

// ------------------------------------
// APP SETUP
// ------------------------------------
const app = express();

// ------------------------------------
// CORS (CRITICAL FIX)
// ------------------------------------
const allowedOrigins = [
	'http://localhost:5173',
	'https://collabquest-three.vercel.app',
];

app.use(
	cors({
		origin: function (origin, callback) {
			// allow REST tools / server-to-server
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);

// ------------------------------------
// MIDDLEWARE
// ------------------------------------
app.use(express.json());

// ------------------------------------
// API ROUTES
// ------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-projects', teamProjectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);

// ------------------------------------
// STATIC FILES
// ------------------------------------
app.use(
	'/profiles',
	express.static(path.join(__dirname, 'Profiles'))
);

// ------------------------------------
// HEALTH CHECK
// ------------------------------------
app.get('/', (req, res) => {
	res.send('CollabQuest API is running...');
});

// ------------------------------------
// SERVER + SOCKET.IO
// ------------------------------------
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

require('./socket/chatSocket')(io);

// ------------------------------------
// START SERVER
// ------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
