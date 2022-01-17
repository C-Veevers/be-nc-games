const db = require("../db")

exports.fetchReviews = async (id=false) => {
    if (!id){
        return await db.query('SELECT * FROM reviews')
    }else{
        return await db.query('SELECT * FROM reviews WHERE review_id = $1',[id])
    }
}
exports.updateReview = async (id) => {
    
}