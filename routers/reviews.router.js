const express = require('express');
reviewRouter = express.Router()
const { getReviews } = require('../controllers/reviews.controller');

reviewRouter.route('/')
    .get(getReviews)


/* reviewRouter.route('/:revId')
    .get()
    .post()
    .patch()
    .delete() */

module.exports = reviewRouter