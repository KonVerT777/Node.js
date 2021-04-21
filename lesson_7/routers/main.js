const express = require('express');

const router = express.Router()

router.use('/', (req, res, next) => {
    res.render('index')
})

module.exports = router