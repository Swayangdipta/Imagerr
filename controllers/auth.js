const formidable = require("formidable")
const User = require("../models/user")
const fs = require('fs')
const jwt = require("jsonwebtoken")
const {expressjwt} = require('express-jwt')
const crypto = require('crypto')

exports.signIn = (req,res) => {
    const {email,password} = req.body
    if(!email || !password) return res.status(400).json({error: "All fields are required.",body: ''})

    User.findOne({email: {$eq: email}}).exec((err,user)=>{
        if(err || !user){
            return res.status(404).json({error: "Email not registered.Signup first.",body: err})
        }

        if(!user.authenticate(password)){
            return res.status(400).json({error: "Email or Password did not matched.",body: "Authorization Error"})
        }

        const token = jwt.sign({_id: user._id},process.env.SECRET)
        res.cookie("token",token,{expire: new Date(Date.now()+2.592e+9)})
        const {_id,name,email,role,accountType,uploads,collections} = user
        return res.json({
            token,
            user:{
                _id,
                name,
                email,
                role,
                accountType,
                uploads,
                collections
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
            user.profilePicture.data = fs.readFileSync(file.profilePicture.filepath)
            user.profilePicture.contentType = file.profilePicture.mimetype
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

exports.forgotPassword = (req,res) => {
    const {email} = req.body

    if(!email || email === "" || email === null){
        return res.status(400).json({error: "No email provided!",body: "Bad Submission."})
    }

    User.findOne({email: {$eq: email}}).exec(async(err,user) => {
        if(err || !user){
            return res.status(404).json({error: "No user found!",body: err})
        }

        let resetToken = await user.generateForgetPasswordToken()
        user.save({validateBeforeSave: false}).then(doc=>{
            let resetUrl = `${req.headers.origin}/password/reset/${resetToken}`
            console.log(resetUrl);
            return res.status(200).json({success: true,message: "Reset Link Sent!"})
        }).catch(err=>{
            return res.status(400).json({error: "Faild to perform forget password!",body: err})
        })
    })
}

exports.resetPassword = (req,res) => {
    const {token: resetToken} = req.params
    const {password,confirmPassword} = req.body

    if(password !== confirmPassword) {
        return res.status(400).json({error: "Passwords did not matched!",body: "Not matched."})
    }

    const resetPasswordToken = 
        crypto.createHash("sha256")
            .update(resetToken)
            .digest('hex')

    User.findOne({
        forgetPasswordToken: resetPasswordToken,
        forgetPasswordExpiry: {$gt: Date.now()}
    }).exec((err,user)=>{
        if(err || !user){
            return res.status(404).json({error: "Not found or time expired for reset!",body: err})
        }

        user.password = password
        user.forgetPasswordExpiry = undefined
        user.forgetPasswordToken = undefined

        user.save((errr,updatedUser)=>{
            if(errr){
                return res.status(500).json({error: "Faild to reset password!",body: errr})
            }

            res.status(200).json({success: true,message: "Password Changed!"})
        })
    })
}

exports.isSignedIn = expressjwt({
    secret: process.env.SECRET,
    algorithms: ['SHA256','HS256','RS256','RSA',"sha1"],
    userProperty: "auth"
})

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.auth._id == req.profile._id;
    if(!checker){
        return res.status(403).json({error: "Not Authorized. Access Denied.",body: "You are not authorized to access/modify this"})
    }

    next()
}

exports.isAdmin = (req,res,next) => {
    if(req.admin.role !== 5 ){
        res.status(403).json({error: "You are not an Admin.",body:""})
    }

    next()
}

exports.isContributor = (req,res,next) => {
    if(req.profile.role !== 2){
        res.status(403).json({error: "You are not an Contributor.",body:""})
    }

    next()
}