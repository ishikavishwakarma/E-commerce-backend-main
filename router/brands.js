const express = require('express');
const router = express.Router()
const { fetchAllBrand } = require('../controller/brands')


router.get('/', fetchAllBrand)


module.exports = router


