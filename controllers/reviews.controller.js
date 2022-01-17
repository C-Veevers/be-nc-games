const { fetchReviews } = require("../models/reviews.models")

exports.getReviews = (req, res, next)=>{
    fetchReviews().then((reviewTable)=>{
        res.status(200)
        console.log(reviewTable.rows[0])
        res.send({msg: reviewTable.rows})
    })
    .catch(err => next(err))
}