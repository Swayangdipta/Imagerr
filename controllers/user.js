const User = require("../models/user")
const _ = require('lodash')

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

exports.updateUser = (req,res) => {
    let user = req.profile
    if(req.body.role){
        if(req.body.role > 2){
            return res.status(403).json({error: "You dont have permission!",message: "Cannot assign role!"})
        }
        if(req.body.role === 2){
            user.accountType = "Creator"
        }
    }
    user = _.extend(user,req.body)

    user.save((err,updatedUser)=>{
        if(err){
            return res.status(400).json({error: "Faild to update user info!",message: err})
        }

        updatedUser.collections = undefined
        updatedUser.uploads = undefined
        updatedUser.bank = undefined
        updatedUser.encrypted_password = undefined
        updatedUser.salt = undefined
        updatedUser.role = undefined

        return res.status(200).json(updatedUser)
    })
}

exports.getUserRole = (req,res) => {
    return res.status(200).json({role: req.profile.role})
}

exports.getUser = (req,res) => {
    req.profile.encrypted_password = undefined
    req.profile.salt = undefined
    req.profile.bank = undefined
    return res.status(200).json(req.profile)
}

exports.deleteUserAccount = (req,res,next) => {
    let user = req.profile

    user.remove((err,user)=>{
        if(err){
            return res.status(400).json({error: "Faild to delete your account!", mesage: err})
        }

        next()
    })
}

// exports.getUserBankDetails = (req,res) => {
//     return res.status(200).json({bank: req.profile.bank})
// }

exports.pushIntoUserUploads = (req,res,image) => {
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

exports.isAuthorizedAsset = (req,res,next) => {
    let checker = req.profile && req.image &&  req.profile._id == req.image.author._id
    console.log(req.profile._id, req.image.author._id);
    if(!checker){
        return res.status(403).json({error: "You are not authorized to modify this asset!",mesage: "Unauthorized"})
    }

    next()
}