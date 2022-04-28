const {
  allCourses,
  searchCourses,
  getCourse,
  getPlaylistDuration,
  getVideoDuration,
  findCourses,
  getAICourses,
} = require("../controllers/courseController/courseController");
const { isSignedIn } = require("../middleware/auth");
const router = require("express").Router();

router.get("/all", isSignedIn, allCourses);
router.get("/search", isSignedIn, searchCourses);
router.get("/get", isSignedIn, getCourse);
router.get("/playlistDuration", isSignedIn, getPlaylistDuration);
router.get("/videoDuration", isSignedIn, getVideoDuration);
router.get("/findCourses", isSignedIn, findCourses);
router.get("/getAICourses", isSignedIn, getAICourses);

module.exports = router;
