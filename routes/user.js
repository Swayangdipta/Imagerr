const router = require('express').Router()
const { isSignedIn, isAuthenticated } = require('../controllers/auth')
const { getUserById, updateUser, getUserRole ,getUser} = require('../controllers/user')

router.param("userId",getUserById)

router.get("/user/role/:userId",isSignedIn,isAuthenticated,getUserRole)
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)

module.exports = router