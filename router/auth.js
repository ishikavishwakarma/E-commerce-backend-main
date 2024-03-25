const express = require('express');
const router = express.Router()
const { checkUser, getUserInfo, logout,allUsers, resetPasswordRequest, resetPassword, register, login, jwt } = require('../controller/auth');
const passport = require('passport');
const authenticateToken = require('../middleware/jwt');

router.post('/signup', register)
router.post('/login', login)
router.get('/userInfo', authenticateToken, jwt)
router.get('/alluser', allUsers)
router.get('/check', authenticateToken, jwt)
router.get('/logout', authenticateToken, logout)
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)


module.exports = router
