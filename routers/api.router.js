const express = require('express');
const apiRouter = express.Router()

//routers
const reviewRouter = require('./reviews.router')
const categoryRouter = require('./categories.router')
const commentRouter = require('./comments.router')
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/comments', commentRouter)


//controllers
const { welcomeMessage } = require('../controllers/welcome.controller')


//end points
apiRouter.get('/', welcomeMessage)



module.exports = apiRouter