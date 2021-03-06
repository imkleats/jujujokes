const mongoose = require('mongoose');
const User = require('./User');
const Joke = require('./Joke');
//const jokes = require('./seed');

const mongoDb = mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        ssl: true
    });

const models = { User, Joke };

module.exports = { mongoDb, models };