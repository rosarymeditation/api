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
        code: code
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
  getCategories: async (req, res) => {
    try {
      const { code } = req.body;

      const findCode = await Language.findOne({ code: code.toString() });
      if (!findCode) {
        return res.status(400).json({ error: true, message: "Language not found" });
      }

      // Only return categories that have active plans in this language
      const categories = await Plan.distinct("category", {
        language: findCode._id,
        isActive: true,
      });
      console.log("Categories ----------------------------Start--------")
      console.log(categories)
      console.log("Categories ----------------------------End--------")
      return res.status(200).json({ categories });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: true, message: err });
    }
  },
  findAllPageNew: async (req, res) => {
    try {
      let { code, limit = 10, page = 1, category } = req.body;

      var findCode = await Language.findOne({ code: code.toString() });
      if (!findCode) {
        return res.status(400).json({ error: true, message: "Language not found" });
      }

      const query = { language: findCode._id };

      // Add category to query only if provided
      if (category) {
        query.category = category;
      }

      const [data, total] = await Promise.all([
        Plan.find(query).skip((page - 1) * limit).limit(limit),
        Plan.countDocuments(query),
      ]);

      return res.status(OK).json({ data, total });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  findAll: async (req, res) => {
    try {
      let { code, date, limit = 10, page = 1 } = req.body;


      
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      const data = await Plan.find({ language: findCode._id }).skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit);


      // .skip((page - 1) * limit) // Skip documents based on the current page
      // .limit(limit);
      //.sort({ verseNum: 1 });
      return res.status(OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
  findAllPage: async (req, res) => {
    try {
      let { code, date, limit = 10, page = 1 } = req.body;
      console.log(req.body)
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      const data = await Plan.find({ language: findCode._id }).skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit);
      const data2 = await Plan.find({ language: findCode._id })

      console.log(data2.length)
      return res.status(OK).json(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).json({ error: true, message: err });
    }
  },
}
