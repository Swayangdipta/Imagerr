const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1 } = require('uuid')
const {ObjectId }= mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encrypted_password: String,
    salt: String,
    collections: [{
        type: ObjectId,
        ref: 'Image'
    }],
    uploads: [{
        type: ObjectId,
        ref: 'Image'
    }],
    purchases: [{
        type: ObjectId,
        ref: 'Image'
    }],
    accountType: {
        type: String,
        default: "User"
    },
    profilePicture: {
        data: Buffer,
        contentType: String
    },
    role: {
        type: Number,
        default: 0
    },
    bank: {
        type: Object
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date
},{timestamps: true})

userSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = v1()
        this.encrypted_password = this.securePassword(password)
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {
    authenticate: function(password){
        return this.encrypted_password === this.securePassword(password);
    },
    securePassword: function(password){
        if(!password) return ''

        try{
            return crypto.createHmac('sha256',this.salt)
                            .update(password)
                            .digest('hex')
        }catch(e){
            return ''
        }
    },
    generateForgetPasswordToken: function(){
        const token = crypto.randomBytes(20).toString('hex')

        // Save to db
        this.forgetPasswordToken = 
            crypto.createHash('sha256')
            .update(token)
            .digest('hex')

        this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000
        return token
    }
}

module.exports = mongoose.model('User',userSchema)