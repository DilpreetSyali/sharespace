const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();              // 1) create app

app.use(express.json());            // 2) common middleware

// routes imports
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');  // 3) import routes

// use routes AFTER app is defined
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);                  // 4) mount

// test route
app.get('/', (req, res) => {
  res.send('ShareSpace Backend API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

