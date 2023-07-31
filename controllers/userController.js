// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const MenuItem = require('../models/menuItem');

const userController = {
  loginPage: (req, res) => {
    res.render('user/login');
  },

  signupPage: (req, res) => {
    res.render('user/signup');
  },

  menuPage: async (req, res) => {
    try {
      const menu = await MenuItem.find();
      res.render('user/menu', { menu });
    } catch (err) {
      req.flash('error', 'Error fetching menu items.');
      res.redirect('/user/menu');
    }
  },

  editProfilePage: (req, res) => {
    
    if (!req.session.user) {
      req.flash('error', 'Please log in to edit your profile.');
      return res.redirect('/user/login');
    }

    const { name, email } = req.session.user;
    res.render('user/edit-profile', { user: { name, email } });
  },

  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User({ name, email, password: hashedPassword });

      await user.save();
      req.session.user = user;
      res.redirect('/user/menu');
    } catch (err) {
      req.flash('error', 'Error signing up.');
      res.redirect('/user/signup');
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/user/login');
      }

      req.session.user = user;
      res.redirect('/user/menu');
    } catch (err) {
      req.flash('error', 'Error logging in.');
      res.redirect('/user/login');
    }
  },

  editProfile: async (req, res) => {
    
    if (!req.session.user) {
      req.flash('error', 'Please log in to edit your profile.');
      return res.redirect('/user/login');
    }

    const { name, password } = req.body;
    try {
      const user = await User.findById(req.session.user._id);
      user.name = name;
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      req.flash('success', 'Profile updated successfully.');
      res.redirect('/user/menu');
    } catch (err) {
      req.flash('error', 'Error updating profile.');
      res.redirect('/user/edit-profile');
    }
  },

  
};

module.exports = userController;
