const Image = require('../models/image')
const formidable = require('formidable')
const _ = require("lodash")
const { uploadImage, destroyImage } = require('../services/imageUpload')
const { pushIntoUserUploads, removeImageFromUserUploads } = require('./user')
const { pushIntoCategory, popFromCategory } = require('./category')

exports.getImageById = (req,res,next,id) => {
    Image.findById(id)
    .populate("author","name email _id")
    .populate("category")
    .exec((err,img)=>{
        if(err){
            return res.status(400).json({error: "Faild to get image information!",message: err})
        }
        req.image = img
        next()
    })
}

exports.getAImage = (req,res) => {
    if(req.image){
        return res.json(req.image)
    }
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
                id: response.img.public_id,
                thumbId: response.thumb.public_id,
                version: response.img.version,
                thumbVersion: response.thumb.version,
                format: response.img.format,
                thumbFormat: response.thumb.format,
                resource_type: response.img.resource_type,
                width: response.img.width,
                height: response.img.height,
                ratio: response.img.width / response.img.height,
                size: (response.img.bytes / 1024)
            }

            newImage.images = imageToStore
            newImage.author = req.profile._id
    
            newImage.save((err,createdImage)=>{
                if(err){
                    return res.status(400).json({error: "Faild to add image!",message: err})
                }
    
                // next() or Add directly to user here
                pushIntoCategory(req,res,createdImage)
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

            popFromCategory(req,res).then(doc=>{
                Image.findByIdAndDelete(req.image._id,(err,deletedImage)=>{
                    if(err){
                        return res.status(500).json({error: "Faild to remove asset from Database!",message: err})
                    }
                    return res.status(200).json({success: true,message: "Asset Removed successfully"})
                }) 
            }).catch(err => {
                return res.status(400).json({error: "Faild to remove asset from category!",message: err})
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
    Image.find()
    .limit(req.query.limit ? req.query.limit : 50)
    .populate("author","_id name email")
    .exec((err,images)=>{
        if(err){
            return res.status(404).json({error: "No images found",message: err})
        }

        return res.status(200).json(images)
    })
}

exports.searchImage = (req, res) => {
    if (req.body.query === '') {
      return res.status(400).json({ error: 'All fields are required!', message: '' });
    }
  
    const query = req.body.query;
    Image.find(
      {
        $or: [
          { title: { $regex: new RegExp(query, 'i') } }, // search for title that contains the query text
          { tags: { $regex: new RegExp(query, 'i') } }, // search for category that contains the query text
        ],
      }
    ).select(' -createdAt -updatedAt -category -tags')
      .then((images) => {
        console.log(images);
        res.status(200).json({ message: 'Images retrieved successfully', data: images });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Internal server error', message: '' });
      });
  };