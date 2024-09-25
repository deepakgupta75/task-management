const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
// const nodemailer = require('nodemailer');


// Register new user and issue JWT token
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create and save new user
    const user = new User({ name, email, password });
    const savedUser = await user.save();

    // Generate a token after user is saved
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '2h' });

    // Send response with the token and user details
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: savedUser,
    });
  } catch (error) {
    console.error("Signup Error: ", error); // Log the error for debugging

    // Check if the error is due to validation or database issues
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation failed, check input data' });
    } else if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(409).json({ error: 'Duplicate email, please use a different one' });
    } else {
      // Send a more user-friendly message for general errors
      res.status(500).json({ error: 'Something went wrong, please try again later' });
    }
  }
};


// Login user and issue JWT token
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {

               // Check if the user exists in the database
               const user = await User.findOne({ email });
               if (!user) {
                   // If user doesn't exist, prompt them to register
                   return res.status(400).json({ error: 'User not registered. Please register first.' });
               }


        // const user = await User.findOne({ email });
        if (!user || user.password !== password) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '2d' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
