const mongoose = require('mongoose');

// This model can be used for additional attendance analytics and reporting
// Most attendance data is stored directly in the Event model
const attendanceAnalyticsSchema = new mongoose.Schema({
  // Reference to the event
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  
  // Event basic info for quick reference
  eventTitle: {
    type: String,
    required: true
  },
  
  eventDate: {
    type: Date,
    required: true
  },
  
  // Summary statistics
  totalRegistered: {
    type: Number,
    default: 0
  },
  
  totalAttended: {
    type: Number,
    default: 0
  },
  
  attendanceRate: {
    type: Number,
    default: 0
  },
  
  // Time tracking
  firstCheckInTime: {
    type: Date
  },
  
  lastCheckInTime: {
    type: Date
  },
  
  // RFID scanner usage metrics
  rfidScansCount: {
    type: Number,
    default: 0
  },
  
  manualEntryCount: {
    type: Number,
    default: 0
  },
  
  // For calculating peak check-in periods
  checkInTimestamps: [
    {
      timestamp: Date
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AttendanceAnalytics', attendanceAnalyticsSchema);