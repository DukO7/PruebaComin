const { config } = require("dotenv");
config();

const COINBASE_API_KEY = 'da22db03-bbf7-4b45-952c-c2336be8f35d';
const COINBASE_WEBHOOK_SECRET = '1f625bd6-a866-4cb7-8f93-4a39126b7446';
const DOMAIN = 'http://localhost:3000';

module.exports = {
  COINBASE_API_KEY,
  COINBASE_WEBHOOK_SECRET,
  DOMAIN
};
