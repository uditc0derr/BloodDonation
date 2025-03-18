const express = require('express');
const http = require('http'); // Required for socket.io
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); // Import DB connection
const initializeSocket = require('./utils/socket');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const seekerRoutes = require('./routes/seekerRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const mapRoutes = require('./routes/mapRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/seekers', seekerRoutes);
app.use('/api/bloodbanks', bloodBankRoutes);
app.use('/api/maps', mapRoutes);

// Initialize Socket.io
const io = initializeSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
