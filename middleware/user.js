const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Middleware to verify JWT for users
function authenticateUser(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    // Verify token
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user; // Save the decoded token data
        next();
    });
}

module.exports = authenticateUser;
