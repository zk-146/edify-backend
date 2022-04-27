const mongoose = require("mongoose");
// const { default: validator } = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const enrolledCoursesSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Active",
  },
  progress: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  chapterCompleted: [
    {
      unitNumber: {
        type: Number,
        required: true,
      },
      topicNumber: {
        type: Number,
        required: true,
      },
    },
  ],
  assessmentsCompleted: [
    {
      unitNumber: {
        type: Number,
        required: true,
      },
    },
  ],
  assignmentsCompleted: [
    {
      unitNumber: {
        type: String,
        required: true,
      },
    },
  ],
});

const EnrolledCourse = mongoose.model("EnrolledCourse", enrolledCoursesSchema);
module.exports = EnrolledCourse;
