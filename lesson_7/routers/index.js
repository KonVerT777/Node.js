const express = require('express')

const mainRouter = require('./main.js')
const taskRouter = require('./task.js')
const authRouter = require('./auth.js')
const apiRouters = require('./api')

const router = express.Router()

router.use('/tasks/', taskRouter)
router.use('/auth/', authRouter)
router.use('/api/v1/', apiRouters)
router.use(mainRouter)


module.exports = router