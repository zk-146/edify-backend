const { default: axios } = require("axios");
const Course = require("../../models/courses");
const gypd = require("./utils");
const formatDuration = require("./utils/formatDuration");
const toSeconds = require("./utils/toSeconds");
const { spawn } = require("child_process");

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.send({ courses });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "An error occurred while fetching the courses" });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { searchField } = req.query;
    const courses = await Course.find({
      $text: { $search: searchField },
    });
    return res.send({ courses });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "An error occurred while fetching the courses" });
  }
};

const getCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const course = await Course.findById(courseId);
    return res.status(200).send(course);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "An error occurred while fetching the courses" });
  }
};

const getPlaylistDuration = async (req, res) => {
  try {
    const playlistLink = req.query.playlistLink;
    const playlistDuration = await gypd({
      playlistId: playlistLink,
      apiKey: process.env.YT_API_KEY,
      formatted: true,
    });

    return res.status(200).send(playlistDuration);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "An error occurred while fetching the duration of course",
    });
  }
};

const getVideoDuration = async (req, res) => {
  const gVideosDetailsURL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&fields=items/contentDetails/duration`;

  function getNextVideosDetailsURL(id) {
    return `${gVideosDetailsURL}&id=${id}&key=${process.env.YT_API_KEY}`;
  }

  async function getDetailsForVideoIds(id) {
    try {
      const { data } = await axios.get(getNextVideosDetailsURL(id));
      return data.items;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  const { videoUrl } = req.query;
  let videoId = videoUrl.split("=")[1];
  videoId = videoId.split("&")[0];

  const video = await getDetailsForVideoIds(videoId);
  const duration = formatDuration(toSeconds(video[0].contentDetails.duration));
  return res.send(duration);
};

const findCourses = async (req, res) => {
  try {
    const { selectedSkills } = req.query;
    const allCourseIds = [];
    console.log(selectedSkills);
    for (let i = 0; i < selectedSkills.length; i++) {
      const courses = await Course.find({
        skills: { $in: [selectedSkills[i]] },
      });
      for (let i = 0; i < courses.length; i++) {
        console.log(courses[i]._id, allCourseIds.indexOf(courses[i]._id));
        if (allCourseIds.indexOf(courses[i]._id.toString()) === -1)
          allCourseIds.push(courses[i]._id.toString());
      }
    }
    console.log({ allCourseIds }, allCourseIds.length);

    const allCourses = [];
    for (let i = 0; i < allCourseIds.length; i++) {
      console.log(allCourseIds[i]);
      const course = await Course.findById(allCourseIds[i]);
      allCourses.push(course);
    }
    console.log({ allCourses }, allCourses.length);

    return res.send({ allCourses });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Error occurred while finding the courses" });
  }
};
const getAICourses = async (req, res) => {
  try {
    const { selectedSkills, courseSelected } = req.query;
    console.log(selectedSkills, courseSelected);
    const python = spawn("python", [
      "./recommendation/recommendation.py",
      selectedSkills,
      courseSelected,
    ]);
    var dataToSend;

    // spawn new child process to call the python script

    // collect data from script
    python.stdout.on("data", function (data) {
      console.log("Pipe data from python script ...");
      dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on("close", (code) => {
      console.log(`child process close all stdio with code ${code}`);
      console.log(dataToSend);
      // send data to browser
      // res.send(dataToSend);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Error occurred while recommending AI Courses" });
  }
};

module.exports = {
  allCourses,
  searchCourses,
  getCourse,
  getPlaylistDuration,
  getVideoDuration,
  findCourses,
  getAICourses,
};
