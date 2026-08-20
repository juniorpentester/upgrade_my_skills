// importer les librairies

require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rate_limit = require('express-rate-limit');


const app = express();

//port
const port = process.env.PORT || 3000;

//basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //this has to be specific
app.use(helmet());

//rate limit
const HOUR = 1;
const limiter = rate_limit({
    windowMs: 1 * HOUR,
    limit: 15,
    message: "You can only make 15 request every Hour!"
});
app.use('/api', limiter);
    
//Database connection
const conn = mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log(`successful connection: ${conn.connection.host}`))
.catch((err)=> console.log(`error: ${err.message}`));

//global error handling functin

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({error: message});
});


app.listen(port, ()=>{
    console.log(`the server is listening on http://localhost:${port}`);
})