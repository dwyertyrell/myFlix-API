/**
 * @file models.js
 * @description Mongoose models for Movie and User in myFlix API.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Movie Schema
 * @typedef {Object} Movie
 * @property {string} title - Movie title
 * @property {string} description - Movie description
 * @property {Object} genre - Genre details
 * @property {string} genre.title - Genre name
 * @property {Object} director - Director details
 * @property {string} director.name - Director name
 * @property {string} director.bio - Director biography
 * @property {Date} director.birthday - Director birthday
 * @property {Date} director.deathYear - Director death year
 * @property {string[]} actors - List of actors
 * @property {string} image - Image URL
 * @property {boolean} featured - Featured flag
 */
let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
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
    image: String,
    featured: Boolean
});

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {number} age - Age
 * @property {string} username - Username
 * @property {string} password - Hashed password
 * @property {string} email - Email address
 * @property {Date} birthday - Birthday
 * @property {Array} favouriteMovies - Array of favorite movie IDs
 */
let userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes a password
 * @function
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validates a password
 * @function
 * @param {string} password - Plain text password
 * @returns {boolean} True if valid
 */
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);

module.exports.movie = movie;
module.exports.user = user;