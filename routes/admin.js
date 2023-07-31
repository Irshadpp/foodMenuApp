const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware');

// Admin login page
router.get('/login', adminController.loginPage);

// Admin menu page
router.get('/menu', isAdmin, adminController.menuPage);

// Add menu items page
router.get('/add-menu-items', isAdmin, adminController.addMenuItemsPage);

// Users list page
router.get('/users', isAdmin, adminController.usersPage);

// Route for changing user role to admin
router.get('/change-role/:userId', isAdmin, adminController.changeUserRole);

// Admin login form submission
router.post('/login', adminController.login);

// Add menu items form submission
router.post('/add-menu-items', isAdmin, adminController.addMenuItems);




module.exports = router;
