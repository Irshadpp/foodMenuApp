const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
