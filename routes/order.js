const router = require('express').Router()
const { getOrderById, createOrder, updateOrderStatus, getASingleOrder } = require('../controllers/order')
const { pushOrderIntoUser, getUserById } = require('../controllers/user')
const { isSignedIn, isAuthenticated } = require('../controllers/auth')

router.param("orderId",getOrderById)
router.param("userId",getUserById)

router.post('/order/:userId',isSignedIn,createOrder,pushOrderIntoUser,updateOrderStatus)
router.post('/orders/:userId/:orderId',isSignedIn,isAuthenticated,getASingleOrder)

module.exports = router