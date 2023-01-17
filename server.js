const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const {config} = require('./config/index')

// Route imports are here
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const imageRoutes = require('./routes/image')
const categoryRoutes = require('./routes/category')

// Express server
const app = express();

// Port for the server
const PORT = config.PORT || 8000;

// Database connection
mongoose.connect(config.DB_URI,{useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res=>{
    console.log('DB CONNECTED <3');
}).catch(e=>{
    console.log(e);
    console.log("DB CONNECTION FAILD!")
})

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",imageRoutes)
app.use("/api",categoryRoutes)

// Starting server
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}...`);
});