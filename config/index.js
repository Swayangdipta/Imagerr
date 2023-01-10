require('dotenv').config()

exports.config = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,

    // CLOUDINARY Config
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}
