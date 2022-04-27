const router = require("express").Router();
const {
  allEnrolledCourses,
  getEnrolledCourse,
  addEnrolledCourses,
  markTopicCompleted,
} = require("../controllers/enrolledCoursesContoller/enrolledCoursesContoller");

const { isSignedIn } = require("../middleware/auth");

router.get("/all", isSignedIn, allEnrolledCourses);
router.get("/get", isSignedIn, getEnrolledCourse);
router.post("/add", isSignedIn, addEnrolledCourses);
router.post("/completedTopic", isSignedIn, markTopicCompleted);

module.exports = router;
