const router = require("express").Router()
const { getCategoryById, getACategory, getAllCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category")

router.param("categoryId",getCategoryById)

router.get('/category/:categoryId',getACategory)
router.get('/category',getAllCategories)
router.post('/category',createCategory)
router.put('/category/:categoryId',updateCategory)
router.delete('/category/:categoryId',deleteCategory)

module.exports = router