const EventModel = require('./_eventModel');

// Auto-close past events
const autoCloseEvents = async () => {
  const now = new Date();
  await EventModel.updateMany({ endDate: { $lt: now }, isActive: true }, { isActive: false });
};

// Create new event
const createEvent = async (req, res) => {
  try {
    await autoCloseEvents();
    
    // Validate that createdBy refers to a valid user ID number
    if (req.body.createdBy) {
      const UserModel = require('../_users/_userModel');
      const user = await UserModel.findOne({ idNumber: req.body.createdBy });
      
      if (!user) {
        return res.status(400).json({ 
          message: 'Invalid creator ID number. User does not exist.' 
        });
      }
    }
    
    // Also validate participants if they're provided
    if (req.body.participants && req.body.participants.length > 0) {
      const UserModel = require('../_users/_userModel');
      
      for (const participantId of req.body.participants) {
        const participant = await UserModel.findOne({ idNumber: participantId });
        if (!participant) {
          return res.status(400).json({ 
            message: `Invalid participant ID number: ${participantId}. User does not exist.`
          });
        }
      }
    }
    
    const event = new EventModel(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    await autoCloseEvents();
    const events = await EventModel.find()
      .populate({
        path: 'createdBy',
        select: 'name role',
        match: { idNumber: { $exists: true } }
      })
      .populate({
        path: 'participants',
        select: 'name role',
        match: { idNumber: { $exists: true } }
      })
      .populate({
        path: 'attendance.user',
        select: 'name role',
        match: { idNumber: { $exists: true } }
      });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get one event
const getEvent = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id)
      .populate({
        path: 'createdBy',
        select: 'name role idNumber',
        match: { idNumber: { $exists: true } }
      })
      .populate({
        path: 'participants',
        select: 'name role idNumber',
        match: { idNumber: { $exists: true } }
      })
      .populate({
        path: 'attendance.user',
        select: 'name role idNumber',
        match: { idNumber: { $exists: true } }
      });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event updated', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Check-in for attendance
const checkIn = async (req, res) => {
  const { eventId } = req.params;
  const { idNumber } = req.body;  // Changed from userId to idNumber

  try {
    // First, validate that the user with this ID number exists
    const UserModel = require('../_users/_userModel');
    const user = await UserModel.findOne({ idNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided ID number' });
    }

    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Changed to match by idNumber
    const alreadyCheckedIn = event.attendance.find(a => a.user === idNumber);
    if (alreadyCheckedIn) {
      return res.status(400).json({ message: 'User already checked in' });
    }

    // Add the user's ID number to attendance
    event.attendance.push({ user: idNumber });
    await event.save();

    res.status(200).json({ message: 'User checked in', event });
  } catch (error) {
    res.status(500).json({ message: 'Error checking in', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  checkIn,
};
