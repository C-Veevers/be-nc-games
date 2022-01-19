const express = require('express');
reviewRouter = express.Router()
const { getReviews, getReviewById, patchReview } = require('../controllers/reviews.controller');
//const getCommentsByRevId = require('getCommentsByRevId');

reviewRouter.route('/')
    .get(getReviews)


reviewRouter.route('/:revId')
    .get(getReviewById)
    //.post()
    .patch(patchReview)
//.delete()

/* reviewRouter.route('/:revID/comments')
    .get(getCommentsByRevId)
 */
module.exports = reviewRouter