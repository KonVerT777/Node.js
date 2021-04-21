const express = require('express')

const router = express.Router()

const taskApiRouter = require('./task.js')

router.use('/tasks/', taskApiRouter)

module.exports = router