require("dotenv").config();
require("./config/dbConnect");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const { authRoutes } = require("./routes");
const { courseRoutes } = require("./routes");
const { enrolledCourseRoutes } = require("./routes");
const Axios = require("axios");
const CodeIDE = require("./CodeIDE/CodeIDE");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrolledCourses", enrolledCourseRoutes);
app.post("/compile", CodeIDE);

app.get("/", (req, res) => {
  res.send("Running ");
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// const { spawn } = require("child_process");

// var dataToSend;
// // spawn new child process to call the python script
// const python = spawn("python", [
//   "./recommendation/recommendation.py",
//   "Data Science",
//   "Arrays",
//   "HTML",
// ]);
// // collect data from script
// python.stdout.on("data", function (data) {
//   console.log("Pipe data from python script ...");
//   dataToSend = data.toString();
// });
// // in close event we are sure that stream from child process is closed
// python.on("close", (code) => {
//   console.log(`child process close all stdio with code ${code}`);
//   console.log(dataToSend);
//   // send data to browser
//   // res.send(dataToSend);
// });
