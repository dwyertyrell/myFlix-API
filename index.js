/**
 * @file index.js
 * @description Entry point for the myFlix API server. Sets up Express, middleware, routes, and database connection.
 */

const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    models = require('./models.js'),
    cors = require('cors');

const { check, validationResult } = require('express-validator');

/**
 * Connect to MongoDB database using environment variable
 */
// Connect to MongoDB
// mongoose.connect(process.env.CONNECTION_URI);
// mongoose.connect('mongodb+srv://football89:basketball@movie-api.dmxnt.mongodb.net/myflixDB?retryWrites=true&w=majority&appName=movie-api')
mongoose.connect('mongodb://172.31.11.176/mongodb-server')


/**
 * Access models from models.js
 * @type {Object}
 */
// Access models
const movies = models.movie,
    users = models.user;

/**
 * Express application instance
 * @type {Object}
 */
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

/**
 * Allowed origins for CORS
 * @type {string[]}
 */
let allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:1234',
    'https://voluble-elf-1a3488.netlify.app/',
    'https://secret-eyrie-53650-99dc45662f12.herokuapp.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application denies access from the origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Initialize authentication
 */
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

/**
 * Root endpoint
 * @name GET/
 * @function
 * @returns {string} Welcome message
 */
app.get('/', (req, res) => {
    res.status(201).send('Welcome to my application!');
});

/**
 * Get all users
 * @name GET/users
 * @function
 * @returns {Array} List of users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await users.find()
        .then((AllUsers) => {
            res.status(202).json(AllUsers);
        }).catch((err) => {
            console.error(err);
            res.status(500).send('error:' + err);
        });
});

/**
 * Get user by username
 * @name GET/users/:username
 * @function
 * @param {string} username - Username to search for
 * @returns {Object} User object
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await users.findOne({ username: req.params.username })
        .then((user) => {
        res.status(202).send(user)
    }).catch((err)=>{
        res.status(500).send('error:' + err);
    });
});

/**
 * Get all movies
 * @name GET/movies
 * @function
 * @returns {Array} List of all movies
 */
app.get('/movies', passport.authenticate('jwt', {session: false}), async(req,res)=> {
    await movies.find()
    .then((movies)=>{
        res.status(202).json(movies);
    }).catch((err)=>{
        console.error(err);
        res.status(500).send('Error:' + err);
    });
})

/**
 * Get movie by title
 * @name GET/movies/:title
 * @function
 * @param {string} title - Movie title to search for
 * @returns {Object} Movie object
 */
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), async(req, res)=> {

    await movies.find({title: req.params.title})
    .then((movie)=> {
        res.status(220).json(movie);
    })
});

/**
 * Get genre information by title
 * @name GET/movies/genres/:title
 * @function
 * @param {string} title - Genre title to search for
 * @returns {Object} Genre information
 */
app.get('/movies/genres/:title', passport.authenticate('jwt', {session: false}), (req, res)=> {
    movies.findOne({"genre.title": req.params.title})
    .then((movie)=>{
        const info = movie.genre
        res.status(202).json(info);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

/**
 * Get director information by name
 * @name GET/movies/directors/:name
 * @function
 * @param {string} name - Director name to search for
 * @returns {Object} Director information
 */
app.get('/movies/directors/:name', passport.authenticate('jwt', {session: false}), (req, res)=> {
    movies.findOne({"director.name": req.params.name})
    .then((movie)=> {
        const info = movie.director;
        res.status(202).json(info);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

/**
 * Register a new user
 * @name POST/users
 * @function
 * @param {string} username - Username (minimum 5 characters, alphanumeric)
 * @param {string} password - Password (required)
 * @param {string} email - Email address (required)
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {number} age - Age
 * @param {Date} birthday - Birthday
 * @returns {Object} Created user object
 */
app.post('/users', 
    [
        check('username', 'username is required').isLength({min: 5}),
        check('username', 'username contains non alphanumeric characters- not allowed').isAlphanumeric(),
        check('password','password is required').not().isEmpty(),
        check('email', 'email is required').isEmail()
    ], 
    (req, res) => {
    
        let errors = validationResult(req);
        if(!errors.isEmpty){
            res.status(422).json({errors: errors.array()});
        };

    
    let hashPassword = users.hashPassword(req.body.password);
     users.findOne({username: req.body.username})
    .then((user) => {
        if(user){
       return res.status(409).send(req.body.username + 'already exists');
    }else { 
        // object must be in json format- keys and values in quotations.
        users.create({ 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            username: req.body.username,
            password: hashPassword,
            email:req.body.email,
            birthday:req.body.birthday
        }).then((user) => {
        res.status(201).json(user)        
        }).catch((error) => {
            res.status(500).send('error:' + error);
        })  
    }
    }).catch((error) => {
    res.status(500).send('error:' + error);
    });
});

/**
 * Update user information
 * @name PUT/users/:username
 * @function
 * @param {string} username - Username to update
 * @param {string} firstName - Updated first name (optional)
 * @param {string} lastName - Updated last name (optional)
 * @param {number} age - Updated age (optional)
 * @param {string} password - Updated password (optional)
 * @param {string} email - Updated email (optional)
 * @param {Date} birthday - Updated birthday (optional)
 * @returns {Object} Updated user object
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async(req, res)=> {
    
    let hashPassword = users.hashPassword(req.body.password)
    await users.findOneAndUpdate(
        {username: req.params.username}, 
        {
            $set: { 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            username: req.body.username,
            password: hashPassword,
            email:req.body.email,
            birthday:req.body.birthday
        }}, {new: true})
        .then((updatedUser)=> {
            res.status(201).json(updatedUser);
        }).catch((err)=> {
            console.error(err);
            res.status(500).send('error:' + err);
        });
});

/**
 * Add movie to user's favorites list
 * @name PUT/users/:username/:movieId
 * @function
 * @param {string} username - Username
 * @param {string} movieId - Movie ID to add to favorites
 * @returns {string} Success message
 */
app.put('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), async(req,res)=> {
    
    await users.findOneAndUpdate({username: req.params.username},
        {$push:{favouriteMovies: req.params.movieId}}, {new: true})  
        .then((user)=>{
            res.status(202).send(req.params.movieId + 'added to' + ' ' + req.params.username+'\'s list of movies')
        }).catch((err)=> {
            console.error(err);
            res.status(500).send('error:' + err);
        });
    });

/**
 * Remove movie from user's favorites list
 * @name DELETE/users/:username/:movieId
 * @function
 * @param {string} username - Username
 * @param {string} movieId - Movie ID to remove from favorites
 * @returns {Object} Updated user object
 */
app.delete('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), async(req, res)=> {
   
    await users.updateOne(
        {username: req.params.username}, 
        {$pull: {favouriteMovies: req.params.movieId}},
        {new: true})
        .then((user)=> {
            res.status(202).json(user);
        }).catch((err)=> {
            console.error(err); 
            res.status(500).send('error:' + err);
        });
});

/**
 * Delete user account
 * @name DELETE/users/:username
 * @function
 * @param {string} username - Username to delete
 * @returns {string} Success or error message
 */
app.delete('/users/:username', passport.authenticate('jwt', {session:false}), async(req, res)=> {
  
    await users.deleteOne({username: req.params.username})
    .then((user)=> {
        if(!user){
            res.status(404).send(`${req.params.username} does not exist`)
        }else{
            res.status(202).send(`${req.params.username} is deleted`);
        }
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

/**
 * Server port configuration
 * @type {number}
 */
const port = process.env.PORT || 8080;

/**
 * Start the server
 * @function
 * @param {number} port - Port number to listen on
 * @param {string} host - Host address (0.0.0.0)
 * @param {Function} callback - Callback function when server starts
 */
app.listen(port, '0.0.0.0', () => {
    console.log('listening on port' + ' '+ port)
})