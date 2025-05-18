const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin, getAdminDetails, resetAdminPassword } = require('./_adminController');

router.post('/', createAdmin); // Create a new admin
router.post('/login', loginAdmin); // Login admin
router.get('/:id', getAdminDetails); // Get admin details
router.post('/reset-password', resetAdminPassword); // Reset admin password

module.exports = router;
