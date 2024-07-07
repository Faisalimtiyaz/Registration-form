// server.js

// Require necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Body parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB (make sure MongoDB is running!)
mongoose.connect('mongodb://localhost:27017/registrationFormDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the User
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Define a route to handle POST requests to /register
app.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.error('Error saving user to database:', err);
      res.status(500).send('Error registering new user.');
    } else {
      console.log('User registered successfully:', newUser);
      res.status(200).send('User registered successfully.');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
