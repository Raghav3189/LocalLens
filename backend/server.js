require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Backend API' });
});

app.post('/api/send-data', (req, res) => {
  console.log("Incoming data:", req.body);
  const {name,age} =req.body;
  res.json({
    message: `Data received: ${name}, Age: ${age}`
  });
});


app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});