const Address = require("../models/address");
const { upload } = require("../utility/global");
const axios = require("axios");

const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);

module.exports = {
  convert: async (req, res) => {
    const { text } = req.body;
    const apiKey = "AIzaSyAw6l4HVAJBP58FJmAPFwSbtcyEZaUoWVQ"; // Replace with your API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "es",
          format: "text",
        }),
      });

      const data = await res.json();

      if (data.error) {
        console.error("API Error:", data.error);
        return;
      }

      console.log("Translated Text:", data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Request Failed:", error);
    }
  },
};
