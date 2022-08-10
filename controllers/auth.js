const formidable = require("formidable")
const User = require("../models/user")
const fs = require('fs')

exports.getUserById = (req,res,next,id) => {

}

exports.signIn = (req,res) => {}

exports.signUp = (req,res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.satus(400),json({error: "Faild to sign up!",body: err})
        }

        let user = new User(fields)

        if(file.profilePicture){
            // 3145728 is equls to 3MB(3*1024*1024)
            if(file.profilePicture.size > 3145728){
                return res.status(400).json({error: "Profile picture size limit reached, max 3MB."})
            }
            // Adding Profile Picture to User Acoount
            user.profilePicture.data = fs.readFileSync(file.profilePicture.path)
            user.profilePicture.contentType = file.profilePicture.type
        }

        user.save((err,registeredUser)=>{
            if(err){
                return res.status(400).json({error: "Faild to sign up! Try Again.",body: err})
            }

            const {name,email} = registeredUser;

            return res.json({
                name,
                email
            })
        })

    })
}