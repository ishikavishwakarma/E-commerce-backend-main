const express = require('express');
const router = express.Router()
const { getALLOderTOAdmin, updateOrder } = require('../controller/admin')

router.get('/', getALLOderTOAdmin)
router.patch('/:id', updateOrder)

/* update user profile */

module.exports = router


