const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        title: String,
    },
    director: {
        name: String,
        bio: String,
        birthday: Date,
        deathYear: Date
    },
    actors: [String],
    ImagePath: String,
    featured: Boolean    
});

let userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favouriteMovies:[{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]

});

let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);

module.exports.movie = movie;
module.exports.user = user;