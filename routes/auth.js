const router = require('express').Router()
const { signUp, signIn,signout, forgotPassword, resetPassword } = require('../controllers/auth')


router.post('/auth/signup',signUp)
router.post('/auth/signin',signIn)
router.get('/auth/signout',signout)
router.post('/auth/password/forgot',forgotPassword)
router.put('/auth/password/reset/:token',resetPassword)

module.exports = router