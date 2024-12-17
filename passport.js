const passport = require('passport'),

// LocalStrategy used for basic http auth initial login for already registered user.
    LocalStrategy =require('passport-local').Strategy,
    models =require('./models'),
    passportJWT = require('passport-jwt');

let users = models.user,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/* this file is for using the jwt with already
 registered(users on the database), and authenticated(uses already recieved jwt token via "auth.js") users,
  "auth.js" file is for authenticating the already existing users.*/

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, callback) => {
            console.log(`$(username) $(password)`);
            await users.findOne({username: username})
            .then((user)=> {
                if (!user) {
                   console.log('incorrect username');
                    return callback(null, false, {
                        message: 'incorrect username or password'
                    });
                }
                console.log('finsihed');
                return callback(null, user);
            }).catch((error)=> {
                if (error) {
                    console.log(error);
                    return callback(error);
                }
            })
        }
    )
);

// for analysing the token that came along with the authenticated user?
passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    }, async (jwtPayload, callback) => {
        return await users.findById(jwtPayload._id)
        .then((user) => {
            /* null is conveniently used to indicate there is no error- "null"
             had been caused during the authentication.
            the "user" parameter is the authenticated object, 
            which is passed back into the inital callback function for further coding
            e.g. to generate a jwt. */
            return callback(null, user);
        })
        .catch((error)=> {
            return callback(error)
        });
    }));


