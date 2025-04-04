const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE_API_URL: process.env.FLIGHT_SERVICE_URL,
}