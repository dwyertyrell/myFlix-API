const express = require('express'),
    morgan = require('morgan');
const app= express();

app.use(morgan('common'));

app.use(express.static('public'));



app.get('/movies', (req,res,) => {
    res.json('data containing the top 10 movies');
});

app.get('/', (req,res,) => {
    res.send('welcome to my app!');
})

app.use((err,req,res, next) => {
    console.log(err.stack);
    res.status(500).send('something broke!');
});

app.listen(8080, () => {
    console.log('your app is running on port 8080');
})