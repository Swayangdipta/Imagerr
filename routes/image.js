const router = require('express').Router()
const { addImage, getImageById, removeImage, getAllImages } = require('../controllers/image')
const { getUserById } = require('../controllers/user')

router.param("userId",getUserById)
router.param("imageId",getImageById)

router.get("/images",getAllImages)
router.post("/upload/:userId",addImage)
router.post("/remove/:userId/:imageId",removeImage)

module.exports = router