const express = require('express');
const router = express.Router()
const { fetchAllProducts, createProduct,readAllProducts, filterProducts,fetchProductById, updateProduct, deletedProduct } = require('../controller/products');
const authenticateToken = require('../middleware/jwt');


router.post('/', authenticateToken, createProduct)
    .get('/', fetchAllProducts)
    .get('/:id', fetchProductById)
    .get('/sort/:categoryId',filterProducts)
    .post('/filter/product',readAllProducts)
    .patch('/:id', authenticateToken, updateProduct)
    .delete('/:id', authenticateToken, deletedProduct)
module.exports = router


