const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    title: String
},{timestamps: true})


module.exports = mongoose.model("Tag",tagSchema)