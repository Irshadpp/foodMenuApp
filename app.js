// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost/food_menu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());
// app.use(expressValidator());

// Middleware to check if the user is logged in
const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};

app.use(authMiddleware);

// Predefined admin email and password
const predefinedAdminEmail = 'admin@example.com';
const predefinedAdminPassword = 'admin123';

// Create admin user if it doesn't exist
const User = require('./models/user');
const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: predefinedAdminEmail });
    if (!adminUser) {
      const hashedPassword = bcrypt.hashSync(predefinedAdminPassword, 10);
      const admin = new User({
        name: 'Admin',
        email: predefinedAdminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

createAdminUser();


// Routes
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  if (req.session.user) {
    // If the user is logged in, redirect to the appropriate menu page based on the role
    if (req.session.user.isAdmin) {
      res.redirect('/admin/menu');
    } else {
      res.redirect('/user/menu');
    }
  } else {
    // If the user is not logged in, redirect to the appropriate login page based on the role
    res.redirect('/user/login');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
