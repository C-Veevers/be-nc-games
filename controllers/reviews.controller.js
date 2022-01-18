const { fetchReviews, updateReview} = require("../models/reviews.models")

exports.getReviews = (req, res, next)=>{
    fetchReviews().then((reviewTable)=>{
        res.status(200)
        res.send({reviews: reviewTable.rows})
    })
    .catch(err => next(err))
}
exports.getReviewById = (req, res, next)=>{
    const {revId} = req.params
    fetchReviews(revId).then(review =>{
        if (review.rowCount == 0){
            res.status(404)
            res.send({msg: "Not Found"})
        }else{
            res.status(200)
            res.send({review: review.rows})
        }
    })
    .catch(err=> next(err))
}
exports.patchReview = (req, res, next)=>{
    const {revId} = req.params
    const {inc_votes} = req.body
    updateReview(revId, inc_votes).then(updatedResult => {
        console.log('updatedResult ==> ',updatedResult.rows)
        res.status(200)
        res.send({review: updatedResult.rows[0]})
    })
    .catch(err=> next(err))
}