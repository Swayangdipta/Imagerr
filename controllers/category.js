const Category = require("../models/category")
const _ = require("lodash")
const { pushIntoUserUploads } = require("./user")

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id)
    .populate("assets")
    .exec((err,category)=>{
        if(err){
            return res.status(404).json({error: "Faild to fetch category!",message: err})
        }

        req.category = category
        next()
    })
}

exports.getACategory = (req,res) => {
    if(!req.category){
        return res.status(404).json({error: "No category found!",message: "404 Not Found"})
    }
    if(req.category.assets.length > req.query.limit){
        req.category.assets = req.category.assets.slice(0,req.query.limit)
    }
    return res.status(200).json(req.category)
}

exports.getAllCategories = (req,res) => {
    Category.find()
    .select("-assets")
    .exec((err,categories)=>{
        if(err){
            return res.status(404).json({error: "No catgories found",message: err})
        }

        return res.status(200).json(categories)
    })
}

exports.createCategory = (req,res) => {
    let category = new Category(req.body)

    category.save((err,createdCategory)=>{
        if(err){
            return res.status(400).json({error: "Faild to create category!",message: err})
        }

        return res.status(200).json(createdCategory)
    })
}

exports.updateCategory = (req,res) => {
    let category = req.category
    category = _.extend(category,req.body)
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({error: "Faild to update category!",message: err})
        }

        return res.status(200).json(updatedCategory)
    })
}

exports.deleteCategory = (req,res) => {
    let category = req.category

    category.remove((err,deletedCategory)=>{
        if(err){
            return res.status(400).json({error: "Faild to delete category!",message: err})
        }

        return res.status(200).json(deletedCategory)
    })
}

exports.pushIntoCategory = (req,res,image) => {
    Category.findByIdAndUpdate(image.category._id,{$push: {"assets": image._id}},
    {safe: true,upsert: true,new: true},
    (err,updatedCategory) => {
        if(err){
            return res.status(400).json({error: "Faild to add image to the category!",message: err})
        }

        pushIntoUserUploads(req,res,image)
    })
}

exports.popFromCategory = (req,res) => {
    try {
        return Category.findByIdAndUpdate(req.image.category,{$pull: {"assets": req.image._id}},
        {safe: true,upsert: true,new: true})
        .then(doc=>{
            return doc
        }).catch(error=>{
            return res.status(400).json({error: "Faild to remove asset from category!",message: error})
        })
    } catch (error) {
        return error
    }
}