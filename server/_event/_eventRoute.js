const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  checkIn,
} = require('./_eventController');

// Create a new event
router.post('/', createEvent);

// Get all events
router.get('/', getAllEvents);

// Get one event by ID
router.get('/:id', getEvent);

// Update event by ID
router.put('/:id', updateEvent);

// Delete event by ID
router.delete('/:id', deleteEvent);

// Check-in user to an event
router.post('/:eventId/checkin', checkIn);

module.exports = router;
