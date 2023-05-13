const User = require("../models/user")
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')
const { log } = require("console")

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

exports.getAdminById = (req,res,next,id) => {
    User.findById(id)
    .populate('uploads')
    .populate("collections")
    .exec((err,user)=>{
        if(err){
            res.status(404).json({error: "Faild to get user.",body:""})
        }

        req.admin = user
        next()
    })
}

exports.getCreatorImages = (req,res) => {
    let data = {
        _id: req.profile._id,
        name: req.profile.name,
        email: req.profile.email,
        images: req.profile.uploads
    }

    return res.status(200).json(data)
}

exports.updateUser = (req,res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error: 'Problem with image.',message: err})
        }

        let user = req.profile
        if(req.body.role){
            if(req.body.role > 2 && !req.admin){
                return res.status(403).json({error: "You dont have permission!",message: "Cannot assign role!"})
            }
            if(req.body.role === 2){
                user.accountType = "Creator"
            }else if(req.body.role === 5){
                user.accountType = "Admin"
            }
        }
        user = _.extend(user,fields)

        if(file.profilePicture){
            if(file.profilePicture.size > 4200000){
                return res.status(400).json({error: 'Max. image limit reached (4MB).'})
            }
            user.profilePicture.data = fs.readFileSync(file.profilePicture.filepath)
            user.profilePicture.contentType = file.profilePicture.mimetype
        }

        user.save((err,updatedUser)=>{
            if(err){
                return res.status(400).json({error: 'Faild to update info.',message: err})
            }
            return res.json(updatedUser)
        })
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

exports.getAllUsers = (req,res) => {
    User.find()
    .select("-profilePicture -encrypted_password -salt")
    .exec((err,users)=>{
        if(err){
            return res.status(404).json({error: "No images found",message: err})
        }

        return res.status(200).json(users)
    })
}

exports.getUserPhoto = (req,res) => {
    res.set('Content-Type',req.profile.profilePicture.contentType)
    return res.send(req.profile.profilePicture.data)
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

exports.pushIntoUserCollections = (req,res) => {
    User.findByIdAndUpdate(req.profile._id,{$push: {"collections": req.body._id}},
    {safe: true,upsert: true,new: true},
    (err,updatedUser)=>{
        if(err){
            return res.status(500).json({error: "Faild to add asset to your collection!",message: err})
        }
        return res.status(200).json({success: true,message: "Asset added to your collection."})
    })
}

exports.removeImageFromUserCollections = (req,res) => {
    // Resolved Error By using $pull instead of $pop
    // and using .then().catch()

    User.findByIdAndUpdate(req.profile._id,{$pull: {"collections": req.body._id}},
        {safe: true,upsert: true,new: true}).exec((err,user)=>{
            if(err){
                return res.status(500).json({error: "Faild to remove image from your collection!",message: err})
            }

            return res.status(200).json({success: true,message: "Asset removed from collection"})
        })
}

exports.pushOrderIntoUser = (req,res,next) => {
    User.findByIdAndUpdate(req.profile._id,{$push: {"purchases": req.orderToBePushed}},
    {safe: true,upsert: true,new: true},
    (err,updatedUser)=>{
        if(err){
            return res.status(500).json({error: "Faild to add order to your purchases!",message: err})
        }
        next()
    })
}