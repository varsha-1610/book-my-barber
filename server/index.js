import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/config.js'; // your MongoDB connection function

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Port from env or default 3000
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ES Modules __dirname setup
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true,
}));

// Serve React build static files
const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));

// Import routes
import clientRoutes from './Routes/clientRoute.js';
import shopRoutes from './Routes/shopRoute.js';
import adminRoutes from './Routes/adminRoute.js';

// Use routes
app.use('/', clientRoutes);
app.use('/s', shopRoutes);
app.use('/ad', adminRoutes);

// Optional: Serve React app for all other routes (for client-side routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(err);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
