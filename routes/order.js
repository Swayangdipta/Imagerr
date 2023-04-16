const router = require('express').Router()
const { getOrderById, createOrder, updateOrderStatus } = require('../controllers/order')
const { pushOrderIntoUser, getUserById } = require('../controllers/user')

router.param("orderId",getOrderById)
router.param("userId",getUserById)

router.post('/order/:userId',createOrder,pushOrderIntoUser,updateOrderStatus)

module.exports = router