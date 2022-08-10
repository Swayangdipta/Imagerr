const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config()

// Route imports are here
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')

// Express server
const app = express();

// Port for the server
const PORT = process.env.PORT || 8000;

// Database connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res=>{
    console.log('DB CONNECTED <3');
}).catch(e=>{
    console.log(e);
    console.log("DB CONNECTION FAILD!")
})

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api",authRoutes)

// Starting server
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}...`);
});