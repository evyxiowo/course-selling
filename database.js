const {Schema, default: mongoose } = require('mongoose');
mongoose.connect('mongodb+srv://evy:7830023044@evyyx.sqlg1.mongodb.net/course-seller-db?retryWrites=true&w=majority');

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileImage: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    coursesEnrolled: [{ type: ObjectId, ref: 'Course' }]
 
})

const adminSchema =  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'admin' },
    profileImage: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    coursesTaught: [{ type: ObjectId, ref: 'Course' }]
})

const courseSchema =  new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: { type: String, required: true },
    duration: { type: Number, required: true },
    courseCategory: { type: String, required: true },
    courseImage: { type: String, required: true },
    courseVideo: { type: String, required: true },
    courseMaterial: [{ type: String }],
    courseStudents: [{ type: ObjectId, ref: 'User' }]
 
})

const purchaseSchema =  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    purchaseDate: { type: Date, default: Date.now },
    purchaseStatus: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' }

 
})

const User = mongoose.model('User', userSchema)

const Admin = mongoose.model('Admin', adminSchema)

const Course = mongoose.model('Course', courseSchema)

const Purchase = mongoose.model('Purchase', purchaseSchema)

module.exports = { User, Admin, Course, Purchase }