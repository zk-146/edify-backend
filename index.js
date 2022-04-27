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
