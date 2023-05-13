const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const {config} = require('./config/index')
const rateLimit = require('express-rate-limit')

// Route imports are here
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const imageRoutes = require('./routes/image')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const adminRoutes = require('./routes/admin')

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

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false
})

// Middlewares
app.use(limiter)
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",imageRoutes)
app.use("/api",categoryRoutes)
app.use("/api",orderRoutes)
app.use("/api",adminRoutes)

// Starting server
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}...`);
});