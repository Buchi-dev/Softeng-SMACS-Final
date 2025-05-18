const UserModel = require("./_userModel");

// Create User
const createUser = async (req, res) => {
  const { idNumber, name, role, year, course, department, position, notes } = req.body;

  try {
    // Check for existing user
    const existingUser = await UserModel.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User with this ID already exists" });
    }

    // Role-based validation
    if (role === 'student' && (!year || !course)) {
      return res.status(400).json({ message: "Students must have year and course" });
    }
    if (role === 'faculty' && (!department || !position)) {
      return res.status(400).json({ message: "Faculty must have department and position" });
    }

    const newUser = new UserModel({
      idNumber,
      name,
      role,
      year,
      course,
      department,
      position,
      notes,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get one user by ID number
const getUser = async (req, res) => {
  const { idNumber } = req.params;

  try {
    const user = await UserModel.findOne({ idNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { idNumber } = req.params;
  const updateData = req.body;

  try {
    // Role-based validation for updates
    if (updateData.role === 'student' && (!updateData.year || !updateData.course)) {
      return res.status(400).json({ message: "Students must have year and course" });
    }
    if (updateData.role === 'faculty' && (!updateData.department || !updateData.position)) {
      return res.status(400).json({ message: "Faculty must have department and position" });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { idNumber },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { idNumber } = req.params;

  try {
    const deletedUser = await UserModel.findOneAndDelete({ idNumber });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Get user by MongoDB _id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
};
