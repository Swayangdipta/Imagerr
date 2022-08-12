const router = require('express').Router()
const { signUp, signIn,signout } = require('../controllers/auth')


router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/signout',signout)

module.exports = router