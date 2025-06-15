// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {
  SERVER_ERROR,
  OK,
  FAILED_AUTH,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
const jwt = require("jsonwebtoken");
// const query = new Query(PostCode);
const secret = process.env.SECRET;
const bcrypt = require("bcryptjs");
const { email1, email2 } = require("../utility/constants");
const {
  CapitalizeFirstLetter,
  sendEmailCustom,
  getVerificationEmailOptions,
} = require("../utility/global");
const User = require("../models/user");
const Subscriber = require("../models/subscriber");
const Country = require("../models/country");
const Role = require("../models/role");
const { generateAccessToken } = require("../utility/tokens");

module.exports = {
  signUp: async (req, res) => {
    try {
      const { password, email, firstname, lastname } = req.body;
      const findEmail = await User.findOne({ email });

      if (findEmail) {
        return res.status(VALIDATION_ERROR).send({
          error: true,
          message: "Email already exist",
        });
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res
            .status(SERVER_ERROR)
            .send({ message: "Error", error: true });
        } else {
          const dataObj = new User({
            email: email,
            password: hash,
            role: "6530595ad24dd0acc26c71e1",
            firstname: CapitalizeFirstLetter(firstname),
            lastname: CapitalizeFirstLetter(lastname),
            email,
          });
          try {
            const data = await dataObj.save();
            const token = jwt.sign(
              {
                id: data.id,
                email: email,
                firstname: firstname,
                lastname: lastname,
              },
              secret,
              {
                expiresIn: "7000d",
              }
            );
            return res.status(OK).send({
              error: false,
              token: token,
              userId: data.id,
            });
          } catch (err) {
            //console.log(err);
            return res.status(SERVER_ERROR).send({
              error: true,
              message: err,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }

    //return res.status(VALIDATION_ERROR).send({ message: error, error: true });
  },

  findUserInfo: async (req, res) => {
    const id = req.userData.id;

    try {
      const data = await User.findById(id);
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
  findProfileData: async (req, res) => {
    const id = req.body.id;

    try {
      const data = await User.findById(id);
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.userData.id;

      const options = { new: true };
      const data = await User.findByIdAndUpdate(
        id,
        { hasDeleted: true },
        options
      );
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(VALIDATION_ERROR).send({ error: true, message: err });
    }
  },

  loginWithOtp: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);

      // Find an existing user (not deleted) or create a new one
      let user = await Subscriber.findOne({
        email: email,
      });

      // Generate verification code
      //const code = generateAccessToken();

      const code = generateAccessToken();

      // user.emailVerificationCode = code;
      //(user.email = email), await user.save();

      // Send verification email
      const mailOptions = getVerificationEmailOptions({
        code,
        email,
      });
      await sendEmailCustom(mailOptions);

      if (user) {
        // Update the existing user
        user.emailVerificationCode = code;

        await user.save();
      } else {
        // Create a new user if not found
        user = new Subscriber({
          emailVerificationCode: code,

          email: email,
        });
        await user.save();
      }

      return res.status(OK).send({
        error: false,
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(SERVER_ERROR).send({
        error: true,
        message: "Internal server error during registration",
      });
    }
  },

  resendEmailOtp: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .send({ error: true, message: "Phone number is required." });
      }

      // Find user by phone number
      const user = await Subscriber.findOne({ email: email });

      if (!user) {
        return res.status(404).send({
          error: true,
          message: "User with this phone number does not exist.",
        });
      }

      // Generate new OTP
      const code = generateAccessToken(); // Replace with 6-digit OTP logic if needed

      // Update user with new OTP and optional OS info
      user.emailVerificationCode = code;

      await user.save();

      // Send SMS
      const mailOptions = getVerificationEmailOptions({
        code,
        email,
      });
      await sendEmailCustom(mailOptions);

      return res.status(200).send({
        error: false,
        message: "OTP resent successfully.",
      });
    } catch (err) {
      console.error("Error resending OTP:", err);
      return res.status(500).send({
        error: true,
        message: "Internal server error while resending OTP.",
      });
    }
  },

  saveSubscriberEmail: async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (!email) {
      return res
        .status(400)
        .send({ error: true, message: "User ID and code are required." });
    }

    try {
      const dataObj = new Subscriber({
        email: email,
      });

      const data = await dataObj.save();

      return res.status(200).send({
        success: true,
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      return res.status(500).send({
        error: true,
        message: "Server error during OTP verification.",
      });
    }
  },
  verifyEmailOtp: async (req, res) => {
    const { code, email } = req.body;
    console.log(req.body);
    console.log(email);
    if (!email || !code) {
      return res
        .status(400)
        .send({ error: true, message: "User ID and code are required." });
    }

    try {
      const user = await Subscriber.findOne({
        email: email,
      });

      if (!user) {
        return res
          .status(404)
          .send({ error: true, message: "User not found." });
      }

      if (user.emailVerificationCode !== code) {
        return res
          .status(401)
          .send({ error: true, message: "Invalid verification code." });
      }

      // Optional: Mark user as verified

      user.emailVerificationCode = null; // Invalidate the OTP after successful use
      await user.save();

      return res.status(200).send({
        isvalid: user.isValid,
        success: true,
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      return res.status(500).send({
        error: true,
        message: "Server error during OTP verification.",
      });
    }
  },
  checkSubscriptionState: async (req, res) => {
    const { email } = req.body;

    console.log(email);
    console.log("----------------ii4i4i4o4o--------")
    if (!email) {
      return res
        .status(400)
        .send({ error: true, message: "User ID and code are required." });
    }

    try {
      const user = await Subscriber.findOne({
        email: email,
      });

      if (!user) {
        return res.status(200).send({ error: true, isvalid: false });
      }

      // Optional: Mark user as verified

      return res.status(200).send({
        isvalid: user.isValid,
        success: true,
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      return res.status(500).send({
        error: true,
        message: "Server error during OTP verification.",
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const id = req.userData.id;
      const formBody = req.body;

      const options = { new: true };
      if (req.files && req.files.avatar) {
        formBody.avatar = req.files.avatar[0].location;
      }
      if (req.files && req.files.banner) {
        formBody.banner = req.files.banner[0].location;
      }
      // console.log(req.body);
      const data = await User.findByIdAndUpdate(id, formBody, options);
      return res.status(OK).send(data);
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  signIn: async (req, res) => {
    try {
      const failedLoginMessage = "Email or password is incorrect.";
      const { email, password } = req.body;

      const user = await User.findOne({
        email: email,
        hasDeleted: false,
      });

      if (!user) {
        return res
          .status(FAILED_AUTH)
          .send({ error: true, message: "Failed Login" });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res
              .status(FAILED_AUTH)
              .send({ error: true, message: "Login failed" });
          } else if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                id: user.id,
              },
              secret,
              {
                expiresIn: "7000 days",
              }
            );

            return res.status(OK).send({
              error: false,
              token: token,
              userId: user.id,
            });
          } else {
            return res
              .status(FAILED_AUTH)
              .send({ error: true, message: "Failed login" });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  sendForgotPasswordCode: async (req, res) => {
    const { email } = req.body;
    //console.log(email);
    try {
      const findUser = await User.findOne({ email: email, hasDeleted: false });
      /// console.log(findUser);
      if (findUser) {
        const options = { new: true };
        const code = Math.floor(Math.random() * 9000) + 1000;
        const user = await User.findByIdAndUpdate(
          findUser._id,
          { verifyCode: code.toString() },
          options
        );
        const msg = {
          to: email,
          from: email1,
          templateId: "d-11a4e4f10ad843548301ecedb3081847",
          dynamic_template_data: {
            user: user.firstname || "user",
            code: code,
          },
        };

        sgMail.send(msg, (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            // console.log("That's wassup!");
          }
        });
        return res.status(OK).send({ message: "Successful" });
      } else {
        return res.status(OK).send({ message: "Email found" });
      }
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  signUp: async (req, res) => {
    try {
      const { password, email, firstname, lastname } = req.body;
      const findEmail = await User.findOne({ email, hasDeleted: false });

      if (findEmail) {
        return res.status(VALIDATION_ERROR).send({
          error: true,
          message: "Email already exist",
        });
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res
            .status(SERVER_ERROR)
            .send({ message: "Error", error: true });
        } else {
          const dataObj = new User({
            email: email,
            password: hash,
            firstname: CapitalizeFirstLetter(firstname),
            lastname: CapitalizeFirstLetter(lastname),
            role: "6530595ad24dd0acc26c71e1",
            email,
          });
          try {
            const data = await dataObj.save();
            const token = jwt.sign(
              {
                id: data.id,
                email: email,
                firstname: firstname,
                lastname: lastname,
              },
              secret,
              {
                expiresIn: "7000d",
              }
            );
            return res.status(OK).send({
              error: false,
              token: token,
              userId: data.id,
            });
          } catch (err) {
            // console.log(err);
            return res.status(SERVER_ERROR).send({
              error: true,
              message: err,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }

    //return res.status(VALIDATION_ERROR).send({ message: error, error: true });
  },

  passwordVerification: async (req, res) => {
    try {
      const { email, code } = req.body;
      // console.log(`code: ${code}   email: ${email}`);
      const findUser = await User.findOne({ email, verifyCode: code });

      if (!findUser) {
        /// console.log("No    email----");
        return res.status(VALIDATION_ERROR).send({
          error: true,
          message: "Code does not exist",
        });
      } else {
        // console.log("Yesyshshshhs");
        return res.status(OK).send({ message: "Successful", error: false });
      }
    } catch (err) {
      console.log(err);
    }

    //return res.status(VALIDATION_ERROR).send({ message: error, error: true });
  },
  changePassword: async (req, res) => {
    try {
      const { email, code, password } = req.body;
      const findUser = await User.findOne({ email, verifyCode: code });

      if (!findUser) {
        return res.status(VALIDATION_ERROR).send({
          error: true,
          message: "Code does not exist",
        });
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res
            .status(SERVER_ERROR)
            .send({ message: "Error", error: true });
        } else {
          const options = { new: true };
          // console.log("0300404040040i0000------00595959");
          const user = await User.findByIdAndUpdate(
            findUser._id,
            { password: hash, verifyCode: "" },
            options
          );

          return res.status(OK).send({ message: "Successful", error: false });
        }
      });
    } catch (err) {
      console.log(err);
    }

    //return res.status(VALIDATION_ERROR).send({ message: error, error: true });
  },

  createRole: async (req, res) => {
    try {
      const { name } = req.body;
      const data = Role({
        name: name,
      });
      await data.save();

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },

  countries: (req, res) => {
    return res.status(OK).send({ data: countries });
  },

  findAll: async (req, res) => {
    try {
      const data = await Country.find();

      return res.status(OK).send({ data: data });
    } catch (err) {
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  countrySearch: async (req, res) => {
    try {
      let hasData = false;
      const { search = "" } = req.body;

      const partialSearchCriteria = {
        name: { $regex: new RegExp(search || "", "i") },
      };
      //const categoryIdSearchCriteria = { canShow: true };
      if (search) {
        hasData = true;
      }

      const data = hasData
        ? await Country.find(partialSearchCriteria)
        : // Skip documents based on the current page

          await Country.find();

      return res.status(OK).send({
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
};
