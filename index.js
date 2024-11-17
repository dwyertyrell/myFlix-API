const express = require('express'),
    morgan = require('morgan'),
    bodyParser=require('body-parser'),
    uuid = require('uuid');
const app= express();

app.use(morgan('common'));
app.use(bodyParser.json())


app.listen(8080, () => {
    console.log('your app is running on port 8080');
});