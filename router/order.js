const express = require('express');
const router = express.Router()
const { createOrder, fetchOrdersByUser, paymentVerification, checkout } = require('../controller/order');
const authenticateToken = require('../middleware/jwt');

router.post('/', authenticateToken, createOrder)
router.get('/', authenticateToken, fetchOrdersByUser)

/* payment */
router.post('/checkout', authenticateToken, checkout)
router.post('/paymentverification', paymentVerification)

// router.delete('/:id', deleteCart)
// router.patch('/:id', updateCart)

module.exports = router


