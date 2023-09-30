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
const { CapitalizeFirstLetter } = require("../utility/global");
const User = require("../models/user");
const Role = require("../models/role");

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
            console.log(err);
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
      console.log(req.body);
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
    console.log(email);
    try {
      const findUser = await User.findOne({ email: email, hasDeleted: false });
      console.log(findUser);
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
            console.log(error);
          } else {
            console.log("That's wassup!");
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
            console.log(err);
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
      console.log(`code: ${code}   email: ${email}`);
      const findUser = await User.findOne({ email, verifyCode: code });

      if (!findUser) {
        console.log("No    email----");
        return res.status(VALIDATION_ERROR).send({
          error: true,
          message: "Code does not exist",
        });
      } else {
        console.log("Yesyshshshhs");
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
          console.log("0300404040040i0000------00595959");
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
};
