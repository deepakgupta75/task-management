require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/task_management',
};
