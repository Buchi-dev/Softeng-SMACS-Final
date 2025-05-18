const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("./_userController");

// Create a new user
router.post("/", createUser);

// Get a user by ID number
router.get("/idNumber/:idNumber", getUser);

// Get a user by MongoDB _id
router.get("/mongo/:id", getUserById);

// Get all users
router.get("/", getAllUsers);

// Update user by ID number
router.put("/:idNumber", updateUser);

// Delete user by ID number
router.delete("/:idNumber", deleteUser);

module.exports = router;