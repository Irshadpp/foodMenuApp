const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const { isUser } = require('../middleware');

// User login page
router.get('/login', userController.loginPage);

// User signup page
router.get('/signup', userController.signupPage);

// User menu page
router.get('/menu', isUser, userController.menuPage);

// User edit profile page
router.get('/edit-profile', isUser, userController.editProfilePage);

// User signup form submission
router.post('/signup', userController.signup);

// User login form submission
router.post('/login', userController.login);

// User edit profile form submission
router.post('/edit-profile', isUser, userController.editProfile);




module.exports = router;
