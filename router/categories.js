const express = require('express');
const router = express.Router()
const { fetchAllCategories } = require('../controller/categories')


router.get('/', fetchAllCategories)


module.exports = router


