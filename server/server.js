require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import Node.js path module

// Import routes
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies

// --- Static File Serving ---
// This makes the 'uploads' folder publicly accessible.
// Any image at /uploads/image.jpg can be accessed via http://localhost:5000/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- Serve Frontend in Production ---
// This part is for when you deploy your app. It tells Express to serve the built React app.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});