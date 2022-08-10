const router = require('express').Router()
const { getUserById, signUp } = require('../controllers/user')

router.param("userId",getUserById)

module.exports = router