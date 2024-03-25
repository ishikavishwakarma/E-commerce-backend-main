const express = require('express');
const router = express.Router()
const { addTOCart, fetchCartByUser, deleteCart, updateCart, deleteAllCart } = require('../controller/cart');
const authenticateToken = require('../middleware/jwt');

router.post('/', authenticateToken, addTOCart)
router.get('/', authenticateToken, fetchCartByUser)
router.delete('/:id', authenticateToken, deleteCart)
router.delete('/all/:id', authenticateToken, deleteAllCart)
router.patch('/:id', authenticateToken, updateCart)




module.exports = router


