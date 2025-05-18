const mongoose = require('mongoose');

// Common fields for all users
const userSchemaFields = {
  idNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true, // Trim whitespace
    index: true // Index for faster queries
  },
  
  name: { 
    type: String, 
    required: true,
    trim: true 
  },

  role: {
    type: String,
    enum: ['student', 'faculty'],
    required: true,
    index: true // Index for faster role-based filtering
  },

  // Optionally handle others with general info
  notes: { 
    type: String,
    trim: true 
  }
};

// Role-specific fields
const studentFields = {
  year: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  }
};

const facultyFields = {
  department: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  }
};

// Create the schema with conditional validation
const userSchema = new mongoose.Schema({
  ...userSchemaFields,
  
  // Student fields - only required if role is student
  year: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true
  },
  course: {
    type: String, 
    required: function() { return this.role === 'student'; },
    trim: true
  },
  
  // Faculty fields - only required if role is faculty
  department: {
    type: String,
    required: function() { return this.role === 'faculty'; },
    trim: true
  },
  position: {
    type: String,
    required: function() { return this.role === 'faculty'; },
    trim: true
  }
}, { 
  timestamps: true,
  // Add methods or query helpers here if needed
});

// Add a compound index for common query patterns if needed
userSchema.index({ role: 1, department: 1 }); // Example for faculty search by department

// Static methods
userSchema.statics.findByIdNumber = function(idNumber) {
  return this.findOne({ idNumber });
};

// Instance methods
userSchema.methods.getFullDetails = function() {
  const baseInfo = {
    id: this._id,
    idNumber: this.idNumber,
    name: this.name,
    role: this.role
  };
  
  if (this.role === 'student') {
    return { ...baseInfo, year: this.year, course: this.course };
  } else if (this.role === 'faculty') {
    return { ...baseInfo, department: this.department, position: this.position };
  }
  
  return baseInfo;
};

module.exports = mongoose.model('User', userSchema);