const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { Admin } = require('../database');

// Middleware to verify JWT for admins
async function authenticateAdmin(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    // Verify token
    jwt.verify(token.split(' ')[1], JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.admin = admin; // Save the decoded admin data
        next();
    });
}

module.exports = authenticateAdmin;
