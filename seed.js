require('dotenv').config();
require('./config/database');

const User = require('./models/user');
const Vacation = require('./models/vacation');

// For better organization, the seed data is being stored in a separate data.js module
const data = require('./data');