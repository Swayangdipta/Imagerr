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
        return img
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