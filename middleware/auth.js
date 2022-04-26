const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.isSignedIn = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");
    const token = bearerToken?.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    console.log(decoded, user);
    if (!user) {
      throw new Error();
    }
    // else if (!user.phone) {
    //   return res
    //     .status(404)
    //     .send({ error: "Please add phone number to continue" });
    // }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      error: "Please authenticate",
    });
  }
};
