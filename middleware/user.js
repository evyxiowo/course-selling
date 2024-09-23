const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('../config');

// Middleware to verify JWT for users
function authenticateUser(req, res, next) {
    console.log("Reached authentication");

    // Log all headers for debugging purposes
    console.log("Request headers: ", req.headers);

    // Check for token in Authorization or token header
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header: ", authHeader);

    // If the header starts with "Bearer", take the token part (after the space)
    const token = authHeader?.split(' ')[1] || req.headers.token;
    console.log("Extracted Token: ", token);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token and decode payload
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        
        console.log("Token verified successfully! User ID: ", decoded.id);

        // Attach userId to request object for use in further middleware or routes
        req.userId = decoded.id;
        next();
    } catch (err) {
        // Handle error in verification
        console.log("Token verification failed: ", err);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}

module.exports = {
    authenticateUser,
};
