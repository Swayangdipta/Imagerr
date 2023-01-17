const router = require('express').Router()
const { isSignedIn, isAuthenticated, signout } = require('../controllers/auth')
const { getUserById, updateUser, getUserRole ,getUser, deleteUserAccount} = require('../controllers/user')

router.param("userId",getUserById)

router.get("/user/role/:userId",isSignedIn,isAuthenticated,getUserRole)
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)
router.delete("/user/:userId",isSignedIn,isAuthenticated,deleteUserAccount,signout)

module.exports = router