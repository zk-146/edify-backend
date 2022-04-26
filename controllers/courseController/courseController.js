const { default: axios } = require("axios");
const bcrypt = require("bcryptjs");
const Course = require("../../models/courses");
const gypd = require("./utils");
const formatDuration = require("./utils/formatDuration");
const toSeconds = require("./utils/toSeconds");

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send({ courses });
  } catch (err) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the courses" });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { searchField } = req.query;
    console.log(searchField);
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
  res.send(duration);
};

module.exports = {
  allCourses,
  searchCourses,
  getCourse,
  getPlaylistDuration,
  getVideoDuration,
};
