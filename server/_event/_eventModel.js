const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  type: { type: String, enum: ['seminar', 'meeting', 'organization', 'general'], required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  // Changed from ObjectId to String for ID number
  createdBy: {
    type: String,  // User's ID number as string
    ref: 'User',
    required: true,
  },

  // Changed from array of ObjectIds to array of ID numbers
  participants: [
    {
      type: String,  // User's ID number as string
      ref: 'User',
    }
  ],

  // Changed from ObjectId to String for ID number in attendance
  attendance: [
    {
      user: { type: String, ref: 'User' },  // User's ID number as string
      checkedInAt: { type: Date, default: Date.now }
    }
  ],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
