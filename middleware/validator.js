const {
  emailValidator,
  phoneValidator,
  passwordValidator,
} = require("../utils/Validator");

module.exports.validator = async (req, res, next) => {
  try {
    console.log({ body: req.body });
    const { username, password, phone } = req.body;
    if (username) {
      const isValidated = username.includes("@")
        ? emailValidator(username)
        : phoneValidator(username);
      if (!isValidated) {
        return res.status(404).send({
          error: "Enter Correct Email/Mobile",
        });
      }
    }
    if (password) {
      if (!passwordValidator(password)) {
        return res.status(404).send({
          error:
            "password should contain atleast 8 characters,one uppercase,one lowercase,one number and atleast one special character",
        });
      }
    }
    if (phone) {
      if (!phoneValidator(phone)) {
        return res.status(404).send({
          error: "Phone Number Not Valid",
        });
      }
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(404).send({
      error: "Validation error",
    });
  }
};
