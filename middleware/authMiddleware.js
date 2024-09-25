const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token.split(' ')[1], jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
};
console.log(token)
console.log(typeof authenticate);  // Should be 'function'


module.exports = authenticate; // Ensure it's correctly exported
