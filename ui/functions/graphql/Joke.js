const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema({
    setup: {
        type: String,
        required: true
    },
    punchline: {
        type: String,
        required: true,
    },
    thumbsup: {
        type: Number,
        default: 0
    },
    thumbsdown: {
        type: Number,
        default: 0
    }
}, {collection: 'Jokes'});

jokeSchema.statics.randomJoke = async function () {
    const jokeCount = await Joke.estimatedDocumentCount();
    const random = Math.floor(Math.random() * jokeCount);

    const randomJoke = await Joke.findOne().skip(random);
    return randomJoke;
}

jokeSchema.statics.deleteManyJokes = async function () {
    return true;
}

const Joke = mongoose.model('Joke', jokeSchema);

module.exports = Joke;