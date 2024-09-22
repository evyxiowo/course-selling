const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User, Purchase, Course } = require('../database.js'); // Import models
const userRouter = Router();

// POST /signup - Register a new user
userRouter.post('/signup', async (req, res) => {
    const { name, email, password, profileImage, address, contactNumber } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profileImage,
            address,
            contactNumber
        });
        await newUser.save();

        res.json({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
});

// POST /signin - User login
userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'User signed in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
});

// POST /purchases - Make a purchase for a course
userRouter.post('/purchases', async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Check if the user and course exist
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        // Create and save the purchase
        const newPurchase = new Purchase({
            user: userId,
            course: courseId,
            purchaseDate: new Date(),
            purchaseStatus: 'completed'
        });
        await newPurchase.save();

        res.json({ message: 'Purchase made successfully', purchase: newPurchase });
    } catch (error) {
        res.status(500).json({ message: 'Error making purchase', error });
    }
});

module.exports = {
    userRouter: userRouter
};
