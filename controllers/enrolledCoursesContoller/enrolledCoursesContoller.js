const moment = require("moment");
const Course = require("../../models/courses");
const EnrolledCourses = require("../../models/enrolledCourses");

const allEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const enrolledCourses = await EnrolledCourses.find({ userId }).populate(
      "courseId"
    );
    if (!enrolledCourses)
      return res
        .status(404)
        .send({ error: "User has not enrolled to a course." });

    return res.send({ enrolledCourses });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: "Error occurred while fetching user's enrolled courses.",
    });
  }
};

const getEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.body, req.params, req.query);
    const courseId = req.query.courseId;

    const enrolledCourse = await EnrolledCourses.findOne({
      userId,
      courseId,
    }).populate("courseId");

    if (!enrolledCourse) throw new Error();

    res.send(enrolledCourse);
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: "Error occurred while fetching the enrolled course.",
    });
  }
};

const addEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.body.courseId;

    const course = await Course.findById(courseId);

    if (!course)
      return res.status(400).send({ error: "Course does not exist" });

    const enrolledCourseExists = await EnrolledCourses.find({
      userId,
      courseId,
    });

    if (enrolledCourseExists.length > 0)
      return res
        .status(409)
        .send({ error: "User has already enrolled to this course" });

    const startDate = moment();
    const endDate = moment().add(parseInt(course.courseDuration), "days");

    const enrolledCourses = await new EnrolledCourses({
      courseId,
      userId,
      status: "Active",
      progress: 0,
      startDate,
      endDate,
    }).save();

    return res.status(201).send({ enrolledCourses });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: "Error occurred while enrolling the user to a course.",
    });
  }
};

const updateEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.body.courseId;
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      error: "Error occurred while updating user's enrolled course.",
    });
  }
};

module.exports = {
  allEnrolledCourses,
  getEnrolledCourse,
  addEnrolledCourses,
};
