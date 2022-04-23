const router = require("express").Router();
const {
  login,
  signUp,
  //   verifyOtp,
  //   resendOtp,
  //   setPassword,
  //   forgetPassword,
  //   resetPassword,
  //   addPhoneNumber,
  //   googleLogin,
  //   googleSignUp,
  //   verifyPhoneNumber,
} = require("../controllers/authController/authController");

const { validator } = require("../middleware/validator");
// const { isAllowed } = require("../middleware/auth");
// const { isSignedIn } = require("../middleware/auth");

router.post("/login", login);
router.post("/signUp", validator, signUp);
// router.post("/signUp", isAllowed, validator, signUp);
// router.post("/verify/:otp/:userId", verifyOtp);
// router.post("/resendOtp/:userId", resendOtp);
// router.post("/setPassword/:userId", validator, setPassword);
// router.post("/forgotPassword", validator, forgetPassword);
// router.post("/resetPassword/:userId", validator, resetPassword);
// router.post("/addPhoneNumber", validator, addPhoneNumber);
// router.post("/verifyPhoneNumber", validator, verifyPhoneNumber);
// router.post("/googleLogin", googleLogin);
// // router.post("/googleLogin", isAllowed, googleLogin);
// router.post("/googleSignUp", googleSignUp);
// // router.post("/googleSignUp", isAllowed, googleSignUp);
// router.post("/articleState", isSignedIn, articleState);
// router.post("/articleDisplayed", isSignedIn, articleDisplayed);
// router.post("/articleSubbed", isSignedIn, articleSubbed);

module.exports = router;
