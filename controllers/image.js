const Image = require('../models/image')
const formidable = require('formidable')
const _ = require("lodash")
const { uploadImage, destroyImage } = require('../services/imageUpload')
const { pushIntoUserUploads, removeImageFromUserUploads } = require('./user')

exports.getImageById = (req,res,next,id) => {
    Image.findById(id)
    .populate("author","-encrypted_password -salt -collections -bank")
    .populate("category")
    .exec((err,img)=>{
        if(err){
            return res.status(400).json({error: "Faild to get image information!",message: err})
        }
        req.image = img
        next()
    })
}

exports.addImage = (req,res) => {
    const form = new formidable.IncomingForm({
        keepExtenstions: true,
    })

    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error: "Faild to parse image!",message: err})
        }

        if(!fields.price  || !fields.isFree){
            return res.status(400).json({error: "All fields are required!",message: ""})
        }

        uploadImage(files.image.filepath).then(response=>{

            let newImage = new Image(fields)
            let imageToStore = {
                id: response.public_id,
                version: response.version,
                format: response.format,
                resource_type: response.resource_type,
                width: response.width,
                height: response.height,
                size: (response.bytes / 1024)
            }

            newImage.images = imageToStore
            newImage.author = req.profile._id
    
            newImage.save((err,createdImage)=>{
                if(err){
                    return res.status(400).json({error: "Faild to add image!",message: err})
                }
    
                // next() or Add directly to user here
                pushIntoUserUploads(req,res,createdImage)
            })
        }).catch(error=>{
            return res.status(400).json({error: "Faild to upload image!",message: error})
        })
    })
}

exports.removeImage = (req,res) => {
    destroyImage(req.image.images.id,req.image.images.resource_type).then((response)=>{ 
        removeImageFromUserUploads(req,req.image._id).then(doc=>{
            if(doc.error){
                return res.status(500).json({error: "Faild to remove asset from your collection!",message: doc.error})
            }
            Image.findByIdAndDelete(req.image._id,(err,deletedImage)=>{
                if(err){
                    return res.status(500).json({error: "Faild to remove asset from Database!",message: err})
                }
                return res.status(200).json({success: true,message: "Asset removed successfully!"})  
            })  
        }).catch(err=>{
            return res.status(500).json({error: "Faild to remove asset from collection!",message:err})
        })   
    }).catch(error => {
        return res.status(400).json({error: "Faild to delete asset from server!",message: error})
    })
}

exports.updateImage = (req,res) => {
    let image = req.image
    image = _.extend(image,req.body)

    image.save((err,updatedImage)=>{
        if(err){
            return res.status(400).json({error: "Faild to update image!",message: err})
        }

        return res.status(200).json(updatedImage)
    })
}

exports.getAllImages = (req,res) => {
    Image.find().exec((err,images)=>{
        if(err){
            return res.status(404).json({error: "No images found",message: err})
        }

        return res.status(200).json(images)
    })
}