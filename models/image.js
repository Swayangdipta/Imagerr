const mongoose = require('mongoose')
const {ObjectId }= mongoose.Schema.Types


const imageSchema = new mongoose.Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    }
},{timestamps: true})


module.exports = mongoose.model("Image",imageSchema)