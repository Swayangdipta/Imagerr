const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    assets: [{
        type: ObjectId,
        ref: "Image"
    }]
},{timestamps: true})

module.exports = mongoose.model("Category",categorySchema)