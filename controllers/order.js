const Order = require('../models/order')
const Image = require('../models/image')

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("images")
    .exec((err,order) => {
        if(err){
            return res.status(500).json({error: "Faild to get order!",message: err})
        }else if(!order){
            return res.status(404).json({error: "No orders found!",message: err})
        }

        req.order = order
        next()
    })
}

exports.getASingleOrder = (req,res) => {
    if(!req.order){
        return res.status(500).json({error: "Faild to get order!",message: ""})
    }

    return res.status(200).json(req.order)
}

const createOrderFree = (req,res,next) => {
    let order = new Order(req.body)
    order.customer = req.profile._id
    order.save((err,savedOrder)=>{
        if(err){
            return res.status(500).json({error: "Faild to place order!",message: err})
        }

        req.orderToBePushed = savedOrder._id
        next()
    })
}

exports.createOrder = (req,res,next) => {
    const {payment_method,images,total_amount} = req.body
    let total_price = 0

    images.forEach(image => {
        Image.findById(image).exec((err,imageDocument) => {
            if(err){
                return res.status(500).json({error: "Faild to fetch order data",message: err})
            }else if(!imageDocument){
                return res.status(404).json({error: "No orders found!",message: err})
            }

            total_price = total_price + imageDocument.price
        })
    });

    if(payment_method === "FREE" && total_price === 0 && total_amount === 0){
        createOrderFree(req,res,next)
    }
}

exports.updateOrderStatus = (req,res) => {
    let orderId = req.body._id ? req.body._id : req.orderToBePushed
    let status = req.body.status ? req.body.status : "COMPLETED"
    Order.findByIdAndUpdate(orderId,{$set: {"order_status": status}},
    {safe: true,upsert: true,new: true},
    (err,order)=>{
        if(err){
            return res.status(500).json({error: "Faild to get order!",message: err})
        }else if(!order){
            return res.status(404).json({error: "No orders found!",message: err})
        }        

        return res.status(200).json({success: true,message: "Order placed successfully."})
    })
}