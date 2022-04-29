const { smtpTransport } = require("../config/mailService");

async function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, info) {
      console.log(error);
      if (error) {
        console.log("error is " + error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve();
      }
    });
  });
}

module.exports = sendMail;
