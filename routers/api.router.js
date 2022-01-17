const express = require('express');
const apiRouter = express.Router()

//routers
const reviewsRouter = require('./reviews.router')
apiRouter.use('/reviews', reviewsRouter)


//controllers
const {welcomeMessage} = require('../controllers/welcome.controller')


//end points
apiRouter.get('/', welcomeMessage)



module.exports = apiRouter