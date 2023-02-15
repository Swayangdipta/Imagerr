const { config } = require('../config')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME, 
    api_key: config.CLOUDINARY_API_KEY, 
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true
})

exports.uploadImage = (image) => {
    return cloudinary.uploader.upload(image).then(img=>{
        return cloudinary.uploader.upload(image,{
            folder: "collections",
            transformation: [
                {overlay: "svgviewer-output_dei2pj"},
                {width: 1000,crop: 'scale'},
                {flags: "layer_apply"}
            ]
        }).then(thumb=>{
            return {
                img,
                thumb
            }
        }).catch(err=>{
            return err
        })
    }).catch(err=>{
        return err
    })
}

exports.destroyImage = (id,type) => {
    return cloudinary.uploader.destroy(id,{resource_type: type}).then(res => {
        return res
    }).catch(err => {
        return err
    })
}