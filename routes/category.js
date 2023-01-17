const router = require("express").Router()
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getCategoryById, getACategory, getAllCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category")
const { getUserById } = require("../controllers/user")

router.param("categoryId",getCategoryById)
router.param("userId",getUserById)

router.get('/category/:categoryId',getACategory)
router.get('/category',getAllCategories)
router.post('/category/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory)
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory)
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteCategory)

module.exports = router