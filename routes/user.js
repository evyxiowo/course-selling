const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");


const { User, Purchase, Course } = require("../database");
const { JWT_USER_PASSWORD } = require("../config");
const { authenticateUser } = require("../middleware/user");

const userRouter = Router();

// Zod schema for signup validation
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
});

// Zod schema for signin validation
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
});


console.log("User router initialized");

// User Signup
userRouter.post("/signup", async function(req, res) {
    try {
        console.log("Signup request received");
        
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        console.log("Signup request validated");
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");
        
        // Create user
        await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        console.log("User created");
        
        res.status(201).json({ message: "Signup succeeded" });
    } catch (error) {
        res.status(400).json({ message: "Error during signup", error: error.message });
    }
});
console.log("Signin route defined");

// User Signin
userRouter.post("/signin", async function(req, res) {
    try {
        console.log("Signin request received");
        
        const { email, password } = signinSchema.parse(req.body);
        console.log("Signin request validated");

        const user = await User.findOne({ email });
        console.log("User found");
        
        if (!user) {
            console.log("User not found");
            
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        // Compare provided password with hashed password in DB
        console.log("Comparing passwords");
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Passwords do not match");
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        // Generate token
        console.log("Generating JWT token");
        console.log(JWT_USER_PASSWORD);
        
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: '24h' });
        console.log("JWT token generated");
        
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during signin:");
        res.status(400).json({ message: "Error during signin", error: error.message });
    }
});

// Get User Purchases
userRouter.get("/purchases", authenticateUser, async function(req, res) {
    console.log("veiges");
    
    try {
        console.log("Purchases ");
        
        const userId = req.userId;

        // Find all purchases made by the user
        const purchases = await Purchase.find({ user: userId }).populate('course');

        // Extract purchased course data
        const coursesData = purchases.map(purchase => purchase.course);

        res.status(200).json({ purchases, courses: coursesData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchases", error: error.message });
    }
});

module.exports = { userRouter };
