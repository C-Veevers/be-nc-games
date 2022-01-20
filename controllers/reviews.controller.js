const { fetchReviews, updateReview, fetchReviewById, insertReview } = require("../models/reviews.models")

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query
    const { limit = 10, p = 0 } = req.query
    fetchReviews(sort_by, order, category, limit, p).then((reviewTable) => {
        res.status(200)
        res.send({ reviews: reviewTable.rows })
    })
        .catch(err => next(err))
}
exports.getReviewById = (req, res, next) => {
    const { revId } = req.params
    fetchReviewById(revId).then(review => {
        if (review.rowCount == 0) {
            res.status(404)
            res.send({ msg: "Not Found" })
        } else {
            res.status(200)
            res.send({ review: review.rows })
        }
    })
        .catch(err => next(err))
}
exports.patchReview = (req, res, next) => {
    const { revId } = req.params
    const { inc_votes } = req.body
    if (inc_votes == undefined) {
        res.status(400)
        res.send({ msg: "Bad Request" })
    } else {
        updateReview(revId, inc_votes).then(updatedResult => {
            res.status(200)
            res.send({ review: updatedResult.rows[0] })
        }).catch(err => next(err))
    }
}
exports.postReview = (req, res, next) => {
    const { owner, title, review_body,
        designer, category,
        review_img_url = "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png" } = req.body
    insertReview(owner, title, review_body, designer, category, review_img_url).then(review => {
        res.status(201)
        res.send({ review: review.rows })
    }).catch(err => next(err))
}