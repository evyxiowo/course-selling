const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
require('dotenv').config();  // Load environment variables from .env


const app = express();
const port = process.env.PORT || 3000;  // Use port from .env, default to 3000 if not set

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

// Connect to MongoDB and start the server
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
   
        });
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);  // Exit process with failure
    }
}

main();
