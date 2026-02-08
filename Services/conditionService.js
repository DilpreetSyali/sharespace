const axios = require("axios");

const CONDITION_URL = process.env.CONDITION_SERVICE_URL;

async function predictCondition(data) {
  const res = await axios.post(CONDITION_URL, data, {
    timeout: 3000
  });
  return res.data.condition;
}

module.exports = { predictCondition };
