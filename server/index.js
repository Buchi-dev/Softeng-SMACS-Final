const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const connectDB = require('./configs/db');
const PORT = 5000;

const adminRoutes = require('./_admins/_adminRoutes');
const userRoutes = require('./_users/_userRoutes');
const eventRoutes = require('./_event/_eventRoute');
const attendanceRoutes = require('./_attendance/_attendanceRoutes');


// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


//routes
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);
// app.use('/api/attendance', attendanceRoutesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});