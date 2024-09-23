const {Schema, default: mongoose } = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileImage: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    coursesEnrolled: [{ type: ObjectId, ref: 'Course' }]
});


const adminSchema =  new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,  default: 'admin' },
    profileImage: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    coursesTaught: [{ type: ObjectId, ref: 'Course' }]
})

const courseSchema =  new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    creatorId: { type: ObjectId, ref: 'adminId' },
    // name: { type: String, required: true },
    // instructor: { type: String, required: true },
    // duration: { type: Number, required: true },
    // courseCategory: { type: String, required: true },
    // courseImage: { type: String, required: true },
    // courseVideo: { type: String, required: true },
    // courseMaterial: [{ type: String }],
    // courseStudents: [{ type: ObjectId, ref: 'User' }],
    // courseReviews: [{ type: ObjectId, ref: 'Review' }],
    // courseEnrollments: [{ type: ObjectId, ref: 'Enrollment' }]


 
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