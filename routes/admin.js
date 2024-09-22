const { Router } = require("express");
const bcrypt = require("bcrypt");
const { User, Admin, Course } = require('../database.js'); // Import models
const adminRouter = Router();

// POST /signup - Register a new user (admin or normal user)
adminRouter.post("/signup", async function(req, res) {
    const { name, email, password, role, profileImage, address, contactNumber } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine if the role is 'admin' or 'user' and save the corresponding user
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default to 'user' if role is not provided
            profileImage,
            address,
            contactNumber
        };

        let newUser;
        if (role === "admin") {
            newUser = new Admin(userData);
        } else {
            newUser = new User(userData);
        }

        // Save the user to the database
        await newUser.save();

        res.json({ message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// POST /signin - User login
adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email }) || await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({ message: "User signed in successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error signing in", error });
    }
});

// POST /course - Create a new course
adminRouter.post("/course", async function(req, res) {
    const { name, description, price, instructor, duration, courseCategory, courseImage, courseVideo, courseMaterial } = req.body;

    try {
        // Create a new course
        const newCourse = new Course({
            name,
            description,
            price,
            instructor,
            duration,
            courseCategory,
            courseImage,
            courseVideo,
            courseMaterial
        });

        // Save the course to the database
        await newCourse.save();

        res.json({ message: `Course '${name}' created successfully`, course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error });
    }
});

// PUT /course - Update an existing course
adminRouter.put("/course", async function(req, res) {
    const { courseId, updatedInfo } = req.body;

    try {
        // Find and update the course
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedInfo, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: `Course with ID ${courseId} updated successfully`, course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error });
    }
});

// GET /course/bulk - Fetch all courses
adminRouter.get("/course/bulk", async function(req, res) {
    try {
        // Fetch all courses
        const courses = await Course.find();

        res.json({ message: "Courses fetched successfully", courses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

module.exports = {
    adminRouter
};
