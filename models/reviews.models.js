const db = require("../db")

exports.fetchReviews = async (id=false) => {
    let query = `SELECT owner, title, review_id, review_body,
    designer, review_img_url, category, created_at, votes FROM reviews`
    
    if (!id){
        return await db.query(query)
    }else{
        query += ` WHERE review_id = $1`
        const reviewTable = db.query(query,[id])
        const commentCount = db.query(`SELECT COUNT(*) FROM comments  WHERE review_id = $1`,[id])
        let result = await Promise.all([reviewTable, commentCount])
        result[0].rows[0].comment_count = result[1].rows[0].count
        return result[0]
    }
}
exports.updateReview = async (id) => {
    
}