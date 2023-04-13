const router = require('express').Router()
const { addImage, getImageById, getAImage, removeImage, getAllImages, updateImage, searchImage } = require('../controllers/image')
const { getUserById,isAuthorizedAsset } = require('../controllers/user')
const { isSignedIn,isAuthenticated,isContributor } = require('../controllers/auth')

router.param("userId",getUserById)
router.param("imageId",getImageById)

router.get("/images",getAllImages)
router.get("/image/:imageId",getAImage)
router.post("/image/search",searchImage)
router.post("/image/:userId",isSignedIn,isAuthenticated,isContributor,addImage)
router.delete("/image/:userId/:imageId",isSignedIn,isAuthenticated,isContributor,removeImage)
router.put("/image/:userId/:imageId",isSignedIn,isAuthenticated,isContributor,updateImage)

module.exports = router