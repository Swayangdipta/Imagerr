const router = require('express').Router()
const { isSignedIn, isAuthenticated, isAdmin, signUp } = require('../controllers/auth')
const { getAllImages, updateImage, getImageById, removeImage } = require('../controllers/image')
const { getUserById, updateUser, getUserRole ,getUser, deleteUserAccount, removeImageFromUserCollections, getUserPhoto, getAdminById, getAllUsers, searchUser} = require('../controllers/user')


router.param('userId',getUserById)
router.param("adminId",getAdminById)
router.param("productId",getImageById)

// User management routes
router.get("/admin/users/:adminId",isSignedIn,isAdmin,getAllUsers)
router.get("/admin/user/:userId",getUser)
router.post("/admin/user/:adminId",isSignedIn,isAdmin,signUp)
router.post("/admin/search/user/:adminId",isSignedIn,isAdmin,searchUser)
router.put("/admin/user/:userId/:adminId",isSignedIn,isAdmin,updateUser)
router.delete("/admin/user/:userId/:adminId",isSignedIn,isAdmin,deleteUserAccount)

// Product Management routes
router.get("/admin/products/:adminId",isSignedIn,isAdmin,getAllImages)
router.put("/admin/product/:productId/:adminId",isSignedIn,isAdmin,updateImage)
router.delete("/admin/product/:productId/:userId/:adminId",isSignedIn,isAdmin,removeImage)

module.exports = router