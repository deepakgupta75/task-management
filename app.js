const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { mongoURI } = require('./config');
// const authenticate = require('./middleware/authMiddleware');
const cors = require('cors');
const bodyParser = require('body-parser');




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware
app.use(bodyParser.json());

app.use(express.json());

app.get("/",(req,res)=>{
    res.json("Hello world")
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection
mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
