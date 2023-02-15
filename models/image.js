const mongoose = require('mongoose')
const {ObjectId }= mongoose.Schema.Types


const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    images: Object,
    tags: [String],
    price: {
        type: Number,
        default: 0,
        required: true
    },
    isFree: {
        type: Boolean,
        default: false,
        required: true
    }
},{timestamps: true})


module.exports = mongoose.model("Image",imageSchema)