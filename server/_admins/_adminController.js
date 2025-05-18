const adminModel = require("./_adminModel");
const bcrypt = require("bcrypt");

// @desc Create a new admin
// @route POST api/admins
// @access Public
const createAdmin = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    const emailLower = email.toLowerCase();
    const existingAdmin = await adminModel.findOne({ email: emailLower });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Don't hash the password here as it will be hashed by the pre-save hook in the model
    const newAdmin = new adminModel({
      firstName,
      middleName,
      lastName,
      email: emailLower,
      password, // The schema pre-save hook will handle hashing
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Login admin
// @route POST api/admins/login
// @access Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    console.log(`Attempting login for email: ${emailLower}`);
    
    const admin = await adminModel.findOne({ email: emailLower });
    if (!admin) {
      console.log("Admin not found with this email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Admin found, comparing passwords");
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Password comparison failed");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Handle the admin document correctly (works with or without _doc)
    let adminData;
    if (admin._doc) {
      const { password: _, ...rest } = admin._doc;
      adminData = rest;
    } else {
      // Convert to object and remove password
      const adminObj = admin.toObject ? admin.toObject() : admin;
      const { password: _, ...rest } = adminObj;
      adminData = rest;
    }

    console.log("Login successful");
    res.status(200).json({ message: "Login successful", admin: adminData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get admin details
// @route GET api/admins/:id
// @access Private (but no token required here)
const getAdminDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { password, ...adminData } = admin._doc;
    res.status(200).json(adminData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset admin password (helper function for fixing existing accounts)
// @route POST api/admins/reset-password
// @access Public
const resetAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const emailLower = email.toLowerCase();

    const admin = await adminModel.findOne({ email: emailLower });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the password directly without double hashing
    admin.password = newPassword;  // Will be hashed by pre-save hook
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdminDetails,
  resetAdminPassword,
};
