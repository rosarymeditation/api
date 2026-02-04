const DailyVerse = require("../models/dailyVerse");
const Saint = require("../models/saint");
const Language = require("../models/language");
const axios = require("axios");
const Plan = require("../models/plan");
const { upload } = require("../utility/global");
const OpenAI = require("openai");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);



module.exports = {
  create: async (req, res) => {
    try {
      const {
        slug,
        name,
        category,
        description,
        totalDays,
        dailyItems,
        code = 0
      } = req.body;
      const photoObject = req.file;
      const photo = photoObject ? req.file.location : null;
      // Basic validation
      var findCode = await Language.findOne({
        code: code || "0",
      });
      if (
        !slug ||
        !name ||
        !category ||
        !totalDays ||
        !dailyItems
      ) {
        return res.status(400).json({
          message: 'Missing required fields',
        });
      }

      // Check if plan already exists
      const existingPlan = await Plan.findOne({ slug });
      if (existingPlan) {
        return res.status(409).json({
          message: 'Plan with this slug already exists',
        });
      }

      // Create plan
      const plan = new Plan({
        slug,
        name,
        category,
        description,
        totalDays,
        dailyItems: JSON.parse(dailyItems),
        thumbnail: photo || "",
        language: findCode._id
      });

      await plan.save();

      return res.status(201).json({
        message: 'Plan created successfully',
        plan,
      });
    } catch (error) {
      console.error('Create plan error:', error);
      return res.status(500).json({
        message: 'Failed to create plan',
      });
    }

  },
  findAll: async (req, res) => {
    try {
      let { code, date } = req.body;

      // const targetDate = new Date(date);
      // var findCode = await Language.findOne({
      //   code: code.toString(),
      // });

      // const data = await DailyReading.findOne({
      //   language: findCode._id,
      //   date: targetDate,
      // });
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      const data = await Plan.find({language:findCode._id});


      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      return res.status(OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
}
