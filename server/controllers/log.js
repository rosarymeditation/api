const Language = require("../models/language");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");

module.exports = {
  rosary: async (req, res) => {
    try {
      console.log("Rosary Accessed");
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  novena: async (req, res) => {
    try {
      console.log("Powerful Novena Accessed");
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  psalms: async (req, res) => {
    try {
      console.log("Powerful Psalms Accessed");
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  mystery: async (req, res) => {
    try {
      console.log("Choose Mystery Accessed");
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  inspiration: async (req, res) => {
    try {
      console.log("Daily Inspiration Accessed");
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
};
