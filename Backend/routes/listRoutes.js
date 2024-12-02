const express = require('express');
const jwt = require('jsonwebtoken');
const List = require('../models/listModel');
const router = express.Router();

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).json({ message: 'You need to login first' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using JWT_SECRET
    req.user = decoded; // Attach decoded token to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' }); // Handle invalid/expired token
  }
};

// Get all lists for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user.userId });
    if (!lists || lists.length === 0) {
      return res.status(404).json({ message: 'No lists found for the user.' });
    }

    res.json({ lists }); // Return lists
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ message: 'Failed to fetch lists. Please try again later.' });
  }
});

// Create a new list
router.post('/', authenticate, async (req, res) => {
  const { name, images } = req.body;

  if (!name || !images || images.length === 0) {
    return res.status(400).json({ message: 'Name and images are required.' });
  }

  try {
    const newList = new List({
      name,
      userId: req.user.userId,
      images,
    });

    await newList.save(); // Save the new list to the database
    res.status(201).json({ message: 'List saved successfully.' });
  } catch (err) {
    console.error('Error saving list:', err);
    res.status(500).json({ message: 'Failed to save list. Please try again later.' });
  }
});

// Update the name of a specific list
router.put('/:id', authenticate, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required to update the list.' });
  }

  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name },
      { new: true } // Return the updated document
    );

    if (!updatedList) {
      return res.status(404).json({ message: 'List not found.' });
    }

    res.json({ message: 'List updated successfully.', name: updatedList.name });
  } catch (err) {
    console.error('Error updating list:', err);
    res.status(500).json({ message: 'Failed to update the list. Please try again later.' });
  }
});

// Delete a specific list
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!list) return res.status(404).json({ message: 'List not found.' });

    res.json({ message: 'List deleted successfully.' });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ message: 'Failed to delete the list. Please try again later.' });
  }
});

module.exports = router;
