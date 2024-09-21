const express = require('express');
const {userRouter} = require("./routes/user")
const {courseRouter} = require("./routes/course")
const { User } = require("./database.js")
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/user", userRouter);
app.use("api/v1/course", courseRouter);
app.use("api/v1/admin", require("./routes/admin")["adminRouter"])


async function main() {

    //store database connection in dotenv file
    await mongoose.connect('mongodb+srv://evy:7830023044@evyyx.sqlg1.mongodb.net/course-seller-db?retryWrites=true&w=majority')
    app.listen(port, () => {
        console.log( `Server is running on port ${port}`);
        })
    }
    
main();
