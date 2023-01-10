const mongoose = require("mongoose")
const User = require("../models/user")

exports.getUserById = (req,res,next,id) => {
    User.findById(id)
    .populate('uploads')
    .populate("collections")
    .exec((err,user)=>{
        if(err){
            res.status(404).json({error: "Faild to get user.",body:""})
        }

        req.profile = user
        next()
    })
}

exports.pushIntoUserUploads = (req,res,data,image) => {
    User.findByIdAndUpdate(req.profile._id,{$push: {"uploads": image._id}},
    {safe: true,upsert: true,new: true},
    (err,updatedUser)=>{
        if(err){
            return res.status(500).json({error: "Faild to add image to your uploads!",message: err})
        }
        return res.status(200).json({success: true,image: image})
    })
}

exports.removeImageFromUserUploads = async (req,id) => {
    // Resolved Error By using $pull instead of $pop
    // and using .then().catch()

    try {
        return User.findByIdAndUpdate(req.profile._id,{$pull: {"uploads": id}},
        {safe: true,upsert: true,new: true})
        .then(doc=>{
            return doc
        }).catch(error=>{
            return {error: error}
        })
    } catch (error) {
        return {error: error}
    }
}