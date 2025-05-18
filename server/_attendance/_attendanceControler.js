const EventModel = require('../_event/_eventModel');
const UserModel = require('../_users/_userModel');

// Get attendance for a specific event
const getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get detailed user information for each attendance record
    const attendanceData = [];
    for (const record of event.attendance) {
      const user = await UserModel.findOne({ idNumber: record.user })
                                  .select('idNumber name email role');
      
      if (user) {
        attendanceData.push({
          ...record.toObject(),
          userDetails: user
        });
      } else {
        attendanceData.push(record.toObject());
      }
    }
    
    res.status(200).json({
      event: {
        _id: event._id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        isActive: event.isActive
      },
      attendance: attendanceData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting attendance', error: error.message });
  }
};

// Get attendance statistics for all events
const getAttendanceStats = async (req, res) => {
  try {
    const events = await EventModel.find();
    
    const stats = events.map(event => {
      // Determine expected attendance based on available data
      let expectedAttendance;
      
      if (event.expectedParticipants && event.expectedParticipants > 0) {
        // Use the explicitly defined expected participants field
        expectedAttendance = event.expectedParticipants;
      } else if (event.participants.length > 0) {
        // Fall back to registered participants if available
        expectedAttendance = event.participants.length;
      } else {
        // Default to attendance count or minimum of 10
        expectedAttendance = Math.max(event.attendance.length, 10);
      }
        
      return {
        _id: event._id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        isActive: event.isActive,
        location: event.location,
        participantCount: event.participants.length,
        attendanceCount: event.attendance.length,
        expectedParticipants: event.expectedParticipants || 0,
        // Calculate rate based on expected attendance
        attendanceRate: (event.attendance.length / expectedAttendance) * 100
      };
    });
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error getting attendance stats', error: error.message });
  }
};

// Manual check-in for user by ID number (for RFID scanning)
const checkInUserById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { idNumber } = req.body;
    
    if (!idNumber) {
      return res.status(400).json({ message: 'ID number is required' });
    }
    
    // Find the user by ID number
    const user = await UserModel.findOne({ idNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided ID' });
    }
    
    // Find the event
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if already checked in
    const alreadyCheckedIn = event.attendance.some(a => a.user === idNumber);
    if (alreadyCheckedIn) {
      return res.status(400).json({ message: 'User already checked in' });
    }
    
    // Add to attendance
    event.attendance.push({ 
      user: idNumber,
      checkedInAt: new Date()
    });
    
    await event.save();
    
    res.status(200).json({
      message: 'User checked in successfully',
      userName: user.name,
      userRole: user.role,
      checkedInAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking in user', error: error.message });
  }
};

// Export attendance data as CSV
const exportAttendanceCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Create CSV header
    let csv = 'ID Number,Checked In At\n';
    
    // Add each attendance record
    event.attendance.forEach(record => {
      csv += `${record.user},${record.checkedInAt}\n`;
    });
    
    // Set headers for download
    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance-${event.title}-${Date.now()}.csv`);
    
    // Send the CSV data
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting attendance', error: error.message });
  }
};

module.exports = {
  getEventAttendance,
  getAttendanceStats,
  checkInUserById,
  exportAttendanceCSV
};