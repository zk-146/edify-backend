const User = require("../../models/users");
const validator = require("validator");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log({ firstName, lastName, email, password, body: req.body });

  let mobile = "7718964516";

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({ error: "Enter a valid email address" });
    }
    if (firstName.trim() === "") {
      return res.status(422).json({ error: "First Name is required" });
    }
    if (lastName.trim() === "") {
      return res.status(422).json({ error: "Last Name is required" });
    }
    // if (mobile.trim().length !== 10) {
    //   return res
    //     .status(422)
    //     .json({ error: "Please enter a 10 digit mobile number" });
    // }

    const user = await new User({
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      password: String(password),
      // mobile: String(mobile),
      role: "user",
    }).save();

    const token = await user.generateAuthToken();

    res.status(201).send({ message: "Account created", token, user });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .send({ error: "Email address has already been taken" });
    }
    console.log(err);
    res.status(500).send({ error: "An error occurred on the server side" });
  }
};

const login = async (req, res) => {
  const delayResponse = (response) => {
    setTimeout(() => {
      response();
    }, 1000);
  };

  const { email, password } = req.body;

  console.log({ email, password });
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    return res.send({ message: "Log in successful", token, user });
  } catch (err) {
    console.log(err.message);
    return delayResponse(() => {
      res.status(400).json({ error: err.message });
    });
  }
};

module.exports = { signUp, login };
