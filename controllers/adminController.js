// controllers/adminController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const MenuItem = require('../models/menuItem');

const adminController = {
  loginPage: (req, res) => {
    res.render('admin/login');
  },

  menuPage: async (req, res) => {
    try {
      const menu = await MenuItem.find();
      res.render('admin/menu', { menu });
    } catch (err) {
      req.flash('error', 'Error fetching menu items.');
      res.redirect('/admin/menu');
    }
  },

  addMenuItemsPage: (req, res) => {
    res.render('admin/add-menu-items');
  },

  usersPage: async (req, res) => {
    try {
      const users = await User.find();
      res.render('admin/users', { users });
    } catch (err) {
      req.flash('error', 'Error fetching users.');
      res.redirect('/admin/users');
    }
  },

  changeUserRole: async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/admin/users');
      }

      user.isAdmin = !user.isAdmin;
      await user.save();

      req.flash('success', `User role changed to ${user.isAdmin ? 'admin' : 'user'}.`);
      res.redirect('/admin/users');
    } catch (err) {
      req.flash('error', 'Error changing user role.');
      res.redirect('/admin/users');
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/admin/login');
      }

      req.session.user = user;
      res.redirect('/admin/menu');
    } catch (err) {
      req.flash('error', 'Error logging in.');
      res.redirect('/admin/login');
    }
  },

  addMenuItems: async (req, res) => {
    const { foodName, category } = req.body;
    try {
      const menuItem = new MenuItem({ foodName, category });
      

      await menuItem.save();
      req.flash('success', 'Menu item added successfully.');
      res.redirect('/admin/menu');
    } catch (err) {
      req.flash('error', 'Error adding menu item.');
      res.redirect('/admin/add-menu-items');
    }
  },

  
};

module.exports = adminController;
