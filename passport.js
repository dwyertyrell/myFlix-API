/**
 * @file passport.js
 * @description Passport strategies for local and JWT authentication in myFlix API.
 */

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    models = require('./models'),
    passportJWT = require('passport-jwt');

let users = models.user,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * LocalStrategy for username/password authentication
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await users.findOne({ username: username })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'incorrect username or password'
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, { message: 'incorrect password' });
                    }
                    console.log('finished');
                    return callback(null, user);
                }).catch((error) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                });
        }
    )
);

/**
 * JWTStrategy for verifying JWT tokens
 */
passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    }, async (jwtPayload, callback) => {
        return await users.findById(jwtPayload._id)
            .then((user) => {
                // null indicates no error; user is the authenticated object
                // The user object is passed back into the initial callback for further processing (e.g., to generate a JWT)
                return callback(null, user);
        })
        .catch((error)=> {
            return callback(error)
        });
    }));


