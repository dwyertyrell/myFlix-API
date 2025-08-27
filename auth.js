/**
 * @file auth.js
 * @description Handles user authentication and JWT token generation for myFlix API.
 */

const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
};

/**
 * POST /login
 * Authenticates user and returns JWT token
 * @name POST/login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false },
            (error, user, info) => {
                if (error || !user) {
                    return res.status(400).json({
                        message: 'something is not right',
                        user: user
                    });
                }
                req.login(user, { session: false }, (error) => {
                    if (error) {
                        res.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.json({ user, token });
                });
            })(req, res);
    });
};

/**
 * Note: When using the generated token in Postman, remove the quotation marks.
 */