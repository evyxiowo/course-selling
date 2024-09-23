const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function authenticateAdmin(req, res, next) {
    const token = req.headers.token;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({
            message: "Token is missing",
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

        // Assign user ID to request object for further use
        req.userId = decoded.id;
        next(); // Proceed to the next middleware
    } catch (error) {
        // Handle any error that occurs during verification
        return res.status(403).json({
            message: "Invalid or expired token",
            error: error.message, // Optionally log the error message for debugging
        });
    }
}

module.exports = {
    authenticateAdmin,
};
