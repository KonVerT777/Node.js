const express = require('express')

const mainRouter = require('./main.js')
const taskRouter = require('./task.js')
const authRouter = require('./auth.js')

const router = express.Router()

router.use('/tasks/', taskRouter)
router.use('/auth/', authRouter)
router.use(mainRouter)


module.exports = router