const express = require('express');
const router = express.Router();

const {
  getEventAttendance,
  getAttendanceStats,
  checkInUserById,
  exportAttendanceCSV
} = require('./_attendanceControler');

// Get attendance statistics for all events
router.get('/stats', getAttendanceStats);

// Get attendance for a specific event
router.get('/:eventId', getEventAttendance);

// Manual check-in for user by ID number (for RFID scanning)
router.post('/:eventId/check-in', checkInUserById);

// Export attendance data as CSV
router.get('/:eventId/export', exportAttendanceCSV);

module.exports = router;