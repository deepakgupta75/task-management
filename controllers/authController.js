const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const nodemailer = require('nodemailer');


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
  
      // Create email transporter for sending the greeting message
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Task Management System!',
        text: `Hello ${name},\n\nThank you for registering at our task management system. We are excited to have you on board.\n\nBest regards,\nTask Management Team`,
      };
  
      // Send the greeting email
      await transporter.sendMail(mailOptions);
  
      // Respond with the token and user details
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: savedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
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
