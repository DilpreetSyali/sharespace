const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();              // 1) create app

app.use(express.json());            // 2) common middleware

// serve static SEO landing page
app.use(express.static(path.join(__dirname, 'public')));

// routes imports
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');  // moved up

// use routes AFTER app is defined
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/feedback', feedbackRoutes);

// SEO test/landing route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
