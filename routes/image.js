const router = require('express').Router()
const { addImage, getImageById, removeImage } = require('../controllers/image')
const { getUserById } = require('../controllers/user')

router.param("userId",getUserById)
router.param("imageId",getImageById)

router.post("/upload/:userId",addImage)
router.post("/remove/:userId/:imageId",removeImage)

module.exports = router