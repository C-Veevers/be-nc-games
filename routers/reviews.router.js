const express = require('express');
reviewRouter = express.Router()
const { getReviews, getReviewById } = require('../controllers/reviews.controller');

reviewRouter.route('/')
    .get(getReviews)


reviewRouter.route('/:revId')
    .get(getReviewById)
    //.post()
    //.patch(patchReview)
    //.delete()

module.exports = reviewRouter