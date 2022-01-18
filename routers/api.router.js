const express = require('express');
const apiRouter = express.Router()

//routers
const reviewRouter = require('./reviews.router')
const categoryRouter = require('./categories.router')
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/categories', categoryRouter)


//controllers
const {welcomeMessage} = require('../controllers/welcome.controller')


//end points
apiRouter.get('/', welcomeMessage)



module.exports = apiRouter