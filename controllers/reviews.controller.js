const { fetchReviews, updateReview} = require("../models/reviews.models")

exports.getReviews = (req, res, next)=>{
    fetchReviews().then((reviewTable)=>{
        res.status(200)
        res.send({msg: reviewTable.rows})
    })
    .catch(err => next(err))
}
exports.getReviewById = (req, res, next)=>{
    const {revId} = req.params
    fetchReviews(revId).then(review =>{
        if (review.rowCount == 0){
            res.status(404)
            res.send({msg: "Review Not Found"})
        }else{
            res.status(200)
            res.send({msg: review.rows})
        }
    })
    .catch(err=> next(err))
}
exports.patchReview = (req, res, next)=>{
    const {revId} = req.params
    updateReview(revId, req.body).then(updatedResult => {
        res.status(200)
        res.send({msg: updatedResult.rows})
    })
    .catch(err=> next(err))
}