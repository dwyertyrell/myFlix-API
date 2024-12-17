const express = require('express'),
    morgan = require('morgan'),
    bodyParser=require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    models = require('./models.js');

mongoose.connect('mongodb://localhost:27017/test');

// acessing the modules exported from the models.js file, via dot notation.
const movies = models.movie,
    users = models.user;
    
const app= express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
let auth =require('./auth')(app);

const passport = require('passport');
require('./passport');

app.get('/', (req, res)=> {
    res.status(201).send('Welcome to my application!');
});

app.get('/users', passport.authenticate('jwt', {session: false}), async(req, res) => {
    await users.find()
    .then((AllUsers) =>{
        res.status(200).json(AllUsers);
    }).catch((err)=>{
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

app.get('/users/:username', passport.authenticate('jwt', {session: false}), async(req, res)=> {
    if(req.body.username !== req.params.username) {
        res.status(400).send('permission denied');
    };
    await users.findOne({username: req.params.username})
    .then((user)=> {
        res.status(200).send(user)
    }).catch((err)=>{
        res.status(500).send('error:' + err);
    });
});

//   1.Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', {session: false}), async(req,res)=> {
    await movies.find()
    .then((movies)=>{
        res.status(200).json(movies);
    }).catch((err)=>{
        console.error(err);
        res.status(500).send('Error:' + err);
    });
})

//  2.Return data about a single movie by title to the user
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), async(req, res)=> {

    await movies.find({title: req.params.title})
    .then((movie)=> {
        res.status(200).json(movie);
    })
});


// 3.Return data about a genre by title
app.get('/movies/genres/:title', passport.authenticate('jwt', {session: false}), (req, res)=> {
    movies.findOne({"genre.title": req.params.title})
    .then((movie)=>{
        const info = movie.genre
        res.status(200).json(info);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});



// 4.Return data about a director by name
app.get('/movies/directors/:name', passport.authenticate('jwt', {session: false}), (req, res)=> {
    movies.findOne({"director.name": req.params.name})
    .then((movie)=> {
        const info = movie.director;
        res.status(200).json(info);
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

// 5.Allow new users to register
app.post('/users', (req, res)=> {
     users.findOne({username: req.body.username})
    .then((user) => {
        if(user){
       return res.status(201).send(req.body.username + 'already exists');
    }else {
        // object must be in json format- keys and values in quotations.
        users.create({ 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            username: req.body.username,
            password: req.body.password,
            email:req.body.email,
            birthday:req.body.birthday
        }).then((user) => {
        res.status(201).json(user)        
        }).catch((error) => {
            res.status(404).send('error:' + error);
        })  
    }
    }).catch((error) => {
    res.status(404).send('error:' + error);
    });
});


// 6.Allow users to update their user info
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async(req, res)=> {
    if(req.body.username !== req.params.username) {
        res.status(400).send('permission denied');
    };
    await users.findOneAndUpdate(
        {username: req.params.username}, 
        {
            $set: { 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            username: req.body.username,
            password: req.body.password,
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
//   7.Allow users to add a movie to their list of favorites
app.put('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), async(req,res)=> {
    if(req.body.username !== req.params.username) {
        res.status(400).send('permission denied');
    };
    await users.findOneAndUpdate({username: req.params.username},
        {$push:{favouriteMovies: req.params.movieId}}, {new: true})  
        .then((user)=>{
            res.status(201).send(req.params.movieId + 'added to' + ' ' + req.params.username+'\'s list of movies')
        }).catch((err)=> {
            console.error(err);
            res.status(500).send('error:' + err);
        });
    });


// screenshot 
//  8.Allow users to remove a movie from their list of favorites
app.delete('/users/:username/:movieId', passport.authenticate('jwt', {session: false}), async(req, res)=> {
    if(req.body.username !== req.params.username) {
        res.status(400).send('permission denied');
    };
    await users.updateOne(
        {username: req.params.username}, 
        {$pull: {favouriteMovies: req.params.movieId}},
        {new: true})
        .then((user)=> {
            res.json(user);
        }).catch((err)=> {
            console.error(err); 
            res.status(500).send('error:' + err);
        });
});
// 9.Allow existing users to deregister
app.delete('/users/:username', passport.authenticate('jwt', {session:false}), async(req, res)=> {
    if(req.body.username !== req.params.username) {
        res.status(400).send('permission denied');
    };
    await users.findOne({username: req.params.username})
    .then((user)=> {
        if(!user){
            res.status(400).send(req.params.username + 'does not exist')
        }else{
            res.status(201).send(req.params.username + ' ' + 'is deleted');
        }
    }).catch((err)=> {
        console.error(err);
        res.status(500).send('error:' + err);
    });
});

app.listen(8080, () => { 
    console.log('your app is running on port 8080');
});


// update the mongo db:
// add a description property for the genre (nested) document 
