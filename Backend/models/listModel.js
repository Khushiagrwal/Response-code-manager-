const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: true,
    ref: 'User',
  },
  images: [
    {
      url: { type: String, required: true },
      code: { type: String, required: true },
    },
  ],
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
