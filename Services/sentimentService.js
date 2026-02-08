const axios = require("axios");

const SENTIMENT_URL = process.env.SENTIMENT_SERVICE_URL;

async function analyzeSentiment(text) {
  const res = await axios.post(SENTIMENT_URL, {
    text
  }, {
    timeout: 3000
  });

  return res.data.sentiment;
}

module.exports = { analyzeSentiment };
