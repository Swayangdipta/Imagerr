const router = require('express').Router()
const { isSignedIn, isAuthenticated, signout } = require('../controllers/auth')
const { getUserById, updateUser, getUserRole ,getUser, deleteUserAccount, pushIntoUserCollections, removeImageFromUserCollections, getUserPhoto, getCreatorImages} = require('../controllers/user')

router.param("userId",getUserById)

router.get("/user/role/:userId",isSignedIn,isAuthenticated,getUserRole)
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)
router.get("/creator/:userId",getCreatorImages)
router.get("/user/image/:userId",getUserPhoto)
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)
router.put("/user/collection/:userId",isSignedIn,isAuthenticated,pushIntoUserCollections)
router.delete("/user/collection/:userId",isSignedIn,isAuthenticated,removeImageFromUserCollections)
router.delete("/user/:userId",isSignedIn,isAuthenticated,deleteUserAccount,signout)

module.exports = router