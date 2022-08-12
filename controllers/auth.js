const formidable = require("formidable")
const User = require("../models/user")
const fs = require('fs')
const jwt = require("jsonwebtoken")

exports.getUserById = (req,res,next,id) => {

}

exports.signIn = (req,res) => {
    const {email,password} = req.body
    if(!email || !password) return res.status(400).json({error: "All fields are required.",body: ''})

    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(404).json({error: "Email not registered.Signup first.",body: err})
        }

        if(!user.authenticate(password)){
            return res.status(400).json({error: "Email or Password did not matched.",body: "Authorization Error"})
        }

        const token = jwt.sign({_id: user._id},process.env.SECRET)
        res.cookie("token",token,{expire: new Date(Date.now()+2.592e+9)})
        const {_id,name,email,role,accountType} = user
        return res.json({
            token,
            user:{
                _id,
                name,
                email,
                role,
                accountType
            }
        })
    })
}

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


exports.signout = (req,res) => {
    res.clearCookie("token")
    return res.json({
        message: "User signed out"
    })
}