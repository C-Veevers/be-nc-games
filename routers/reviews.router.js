const express = require('express');
reviewRouter = express.Router()
const { getReviews, getReviewById, patchReview, postReview } = require('../controllers/reviews.controller');
const { getCommentsByRevId, postCommentByRevId } = require('../controllers/comments.controller');

reviewRouter.route('/')
    .get(getReviews)
    .post(postReview)


reviewRouter.route('/:revId')
    .get(getReviewById)
    //.post()
    .patch(patchReview)
//.delete()

reviewRouter.route('/:revId/comments')
    .get(getCommentsByRevId)
    .post(postCommentByRevId)

module.exports = reviewRouter