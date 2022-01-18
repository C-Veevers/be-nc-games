const db = require("../db")
const { hasReview, addCount } = require("../utils/utils")

exports.fetchReviews = async (id=false) => {
    let queryString = `SELECT owner, title, review_id, review_body,
    designer, review_img_url, category, created_at, votes FROM reviews`
    
    if (!id){
        return await db.query(queryString)
    }else{
        if (!await hasReview(id)){
            return Promise.reject({ status: 404, msg: 'Not Found'})
        }else{
            queryString += ` WHERE review_id = $1`
            return await addCount(queryString, id)
        }
    }
}
exports.updateReview = async (id, inc) => {
    console.log('<-- increment', inc)
    console.log('<-- model')
    let queryString = `UPDATE reviews SET votes = votes+$1 WHERE review_id = $2 RETURNING *;`
    let input = [inc, id]
    return await db.query(queryString, input)
}