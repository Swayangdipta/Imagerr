const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const orderSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: ObjectId,
        ref: 'Image'
    }],
    customer: {
        type: ObjectId,
        ref: 'User'
    },
    total_amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        default: "PLACED"
    },
    payment_status: {
        type: String,
        required: true
    },
    payment_details: {
        type: Object,
        reuired: true
    }
},{timestamps: true})

module.exports = mongoose.model("Order",orderSchema)