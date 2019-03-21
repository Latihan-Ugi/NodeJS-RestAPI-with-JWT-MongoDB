const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;


/* Import Routes */
const productRoutes = require('./api/routes/products');


/* MongoDB Connection */
// MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
//     if (err) throw err;
//     console.log("Connect to database succesfully!");
//     db.close();
// });
const database = 'toko-online'
const urlDatabase = `mongodb://localhost:27017/${database}`;
mongoose.connect(`${urlDatabase}`, { useNewUrlParser: true })
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.error('Database connection error');
    })


app.use(morgan('dev'));
// app.use(express.static('assets'));
app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/* Cors Handling */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


/* Routes Api */
app.use('/products', productRoutes);


/* Error Handling */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status - 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;