const express = require('express');
const {userRouter} = require("./routes/user")
const {courseRouter} = require("./routes/course")

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'your-secret-key' }));
app.use("/user", userRouter);
app.use("/course", courseRouter);




app.listen(port, () => {
   console.log( `Server is running on port ${port}`);
   })
