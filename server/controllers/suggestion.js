// const PostCode = require("../models").PostCode;
// const Query = new require("../queries/crud");
// const validate = require("../validations/validation");
const Feed = require("../models/suggestion");
const User = require("../models/user");
const { upload, sendEmailCustom, getDailyReadingsFeedbackAdminEmailOptions, getRosaryFeedbackAdminEmailOptions } = require("../utility/global");
const nodemailer = require("nodemailer");

const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
const Suggestion = require("../models/suggestion");
// const query = new Query(PostCode);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // Use SSL if port is 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
module.exports = {
  create: async (req, res) => {
    try {
      const { title, email, desc, category } = req.body;

      if (!email || !title || !desc) {
        return res.status(400).json({ error: "All fields are required" });
      }

      sendEmailCustom(
        getRosaryFeedbackAdminEmailOptions({ title, email, desc, category })
      ).catch((err) => {
        console.error("[sendmailForRosary] Email failed:", err.message);
      });

      res.status(OK).json({ success: true, message: "Feedback received." });

    } catch (error) {
      console.error("[sendmailForRosary] Error:", error);
      res.status(SERVER_ERROR).json({ success: false, error: error.message });
    }
    // try {
    //   const body = req.body;
    //   const data = Suggestion(body);
    //   await data.save();

    //   return res.status(OK).send({ error: false });
    // } catch (err) {
    //   return res.status(OK).send({ error: true });
    // }
  },

  sendmailForRainsomnia: async (req, res) => {
    try {
      const { sender, subject, message, name } = req.body;

      if (!sender || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      sendEmailCustom(
        getDailyReadingsFeedbackAdminEmailOptions({ sender, subject, message, name })
      ).catch((err) => {
        console.error("[sendmailForDailyReadings] Email failed:", err.message);
      });

      res.status(OK).json({ success: true, message: "Feedback received." });

    } catch (error) {
      console.error("[sendmailForDailyReadings] Error:", error);
      res.status(SERVER_ERROR).json({ success: false, error: error.message });
    }
    // try {

    //   const { sender, subject, message, name } = req.body;

    //   if (!sender || !subject || !message) {
    //     return res.status(400).json({ error: "All fields are required" });
    //   }
    //   const emailHtml = `
    //         <html>
    //         <head>
    //             <style>
    //                 body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    //                 .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
    //                 .header { font-size: 20px; font-weight: bold; color: #333; }
    //                 .content { margin-top: 10px; font-size: 16px; color: #555; }
    //                 .footer { margin-top: 20px; font-size: 14px; color: #777; }
    //             </style>
    //         </head>
    //         <body>
    //             <div class="container">
    //                 <p class="header">New Feedback from ${sender}</p>
    //                 <p class="content">${message}</p>
    //                 <p class="content">Name:${name}</p>
    //                 <p class="footer">You can reply directly to <a href="mailto:${sender}">${sender}</a></p>
    //             </div>
    //         </body>
    //         </html>
    //     `;

    //   const mailOptions = {
    //     from: "support@rainsomnia.com", // Dynamic sender
    //     to: "support@rainsomnia.com",
    //     subject: subject,
    //     text: message,
    //     replyTo: sender,
    //     html: emailHtml,
    //   };

    //   const info = await transporter.sendMail(mailOptions);
    //   res.json({ success: true, message: "Email sent successfully", info });
    // } catch (error) {
    //   res.status(500).json({ success: false, error: error.message });
    // }
  },
};
