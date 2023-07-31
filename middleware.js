// middleware.js
const isAdmin = (req, res, next) => {
    // Check if the user is an admin, if not, redirect to login page
    if (req.session.user && req.session.user.isAdmin) {
      return next();
    } else {
      res.redirect('/admin/login');
    }
  };
  
  const isUser = (req, res, next) => {
    // Check if the user is logged in, if not, redirect to login page
    if (req.session.user) {
      return next();
    } else {
      res.redirect('/user/login');
    }
  };
  
  module.exports = { isAdmin, isUser };
  