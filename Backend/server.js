require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Predefined valid status codes
const validCodes = [
  ...Array.from({ length: 4 }, (_, i) => 100 + i), // 100 to 103
  ...Array.from({ length: 9 }, (_, i) => 200 + i), // 200 to 208
  218, 226, 
  ...Array.from({ length: 9 }, (_, i) => 300 + i), // 300 to 308
  ...Array.from({ length: 41 }, (_, i) => 400 + i), // 400 to 440
  444, 
  ...Array.from({ length: 3 }, (_, i) => 449 + i), 
  460, 463, 464, 494,
  ...Array.from({ length: 62 }, (_, i) => 495 + i), 
  ...Array.from({ length: 11 }, (_, i) => 520 + i), 
  561, 598, 599, 999
];

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lists', listRoutes);

// Search Route
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const images = [];

  if (/^\d{3}$/.test(query)) {
    const code = parseInt(query, 10);
    if (validCodes.includes(code)) {
      images.push({ url: `https://http.dog/${code}.jpg`, code: query });
    } else {
      return res.status(400).send('Invalid response code');
    }
  } else if (/^\d{1}[x]{2}$/.test(query)) {
    const prefix = query[0];
    const validRange = validCodes.filter((code) => code.toString().startsWith(prefix));

    if (validRange.length > 0) {
      validRange.forEach((code) =>
        images.push({ url: `https://http.dog/${code}.jpg`, code: code.toString() })
      );
    } else {
      return res.status(400).send('Invalid query format or range');
    }
  } else {
    return res.status(400).send('Invalid query format. Use a valid 3-digit code or range like 2xx, 3xx.');
  }

  res.json({ images });
});

// Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
