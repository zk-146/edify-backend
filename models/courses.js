const mongoose = require("mongoose");
// const { default: validator } = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const coursesSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  playlistLink: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfVideos: {
    type: Number,
  },
  numberOfAssignment: {
    type: Number,
  },
  numberOfAssessments: {
    type: Number,
  },
  numberOfUnits: {
    type: Number,
    required: true,
  },
  courseDuration: {
    type: Number,
  },
  PreRequisite: {
    type: String,
    required: true,
    trim: true,
  },
  Resources: {
    type: String,
    required: true,
    trim: true,
  },
  Units: [
    {
      Content: {
        contentType: {
          type: String,
          required: true,
          trim: true,
        },
        videoLink: {
          type: String,
          trim: true,
        },
      },
    },
  ],
  tags: {
    type: Array,
  },
  courseDescription: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
