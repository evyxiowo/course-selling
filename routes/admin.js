const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const adminRouter = Router();
const { Admin, Course } = require("../database");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { authenticateAdmin } = require("../middleware/admin");

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

// Zod schema for course creation and update
const courseSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    price: z.number().positive()
});

// Admin Signup
adminRouter.post("/signup", async function(req, res) {
    try {
        console.log("Admin signup request received");
        
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        console.log("Parsed signup request: ", { email, password, firstName, lastName });
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);
        

        // Create admin
        await Admin.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "admin"
        });
        
        console.log("Admin created: ", admin);

        res.status(201).json({ message: "Signup succeeded", adminId: admin._id });
    } catch (error) {
        res.status(400).json({ message: "Error during signup", error: error.message });
    }
});

// Admin Signin
adminRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = signinSchema.parse(req.body);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD, { expiresIn: '24h' });

        res.status(200).json({ message: "Signin succeeded", token });
    } catch (error) {
        res.status(400).json({ message: "Error during signin", error: error.message });
    }
});

// Create Course (Admin only)
adminRouter.post("/course", authenticateAdmin, async function(req, res) {
    try {
        const adminId = req.userId;
        console.log("Admin creating course request received", adminId);
        

        const { title, description, imageUrl, price } = courseSchema.parse(req.body);
        console.log("Parsed course creation request: ", { title, description, imageUrl, price });
        
        const course = await Course.create({  
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId
        });

        res.status(201).json({ message: "Course created", courseId: course._id });
    } catch (error) {
        res.status(400).json({ message: "Error during course creation", error: error.message });
    }
});

// Update Course (Admin only)
adminRouter.put("/course", authenticateAdmin, async function(req, res) {
    try {
        const adminId = req.userId;

        const { title, description, imageUrl, price, courseId } = courseSchema.extend({ courseId: z.string() }).parse(req.body);

        const course = await Course.updateOne(
            { _id: courseId, creatorId: adminId },
            { title, description, imageUrl, price }
        );

        if (!course.nModified) {
            return res.status(404).json({ message: "Course not found or not authorized" });
        }

        res.status(200).json({ message: "Course updated", courseId });
    } catch (error) {
        res.status(400).json({ message: "Error during course update", error: error.message });
    }
});

// Get All Courses Created by Admin (Admin only)
adminRouter.get("/course/bulk", authenticateAdmin, async function(req, res) {
    try {
        const adminId = req.userId;

        const courses = await Course.find({ creatorId: adminId });

        res.status(200).json({ message: "Courses retrieved", courses });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving courses", error: error.message });
    }
});

module.exports = { adminRouter };
