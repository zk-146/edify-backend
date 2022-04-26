const {
  allCourses,
  searchCourses,
  getCourse,
  getPlaylistDuration,
  getVideoDuration,
} = require("../controllers/courseController/courseController");

const { isSignedIn } = require("../middleware/auth");

const router = require("express").Router();

router.get("/all", isSignedIn, allCourses);
router.get("/search", isSignedIn, searchCourses);
router.get("/get", isSignedIn, getCourse);
router.get("/playlistDuration", getPlaylistDuration);
router.get("/videoDuration", getVideoDuration);
// router.get("/course", isSignedIn, course);

module.exports = router;
