const router = require('express').Router()
const { getUserById } = require('../controllers/user')

router.param("userId",getUserById)

module.exports = router