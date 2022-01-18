const db = require("../db")

exports.hasReview = async (id) =>{
    let check =  await db.query(`SELECT * FROM reviews WHERE review_id = $1`,[id])
    return (check.rows.length) ? true : false
}
exports.addCount = async (query, id) => {
    const reviewTable = db.query(query,[id])
    const commentCount = db.query(`SELECT COUNT(*) FROM comments  WHERE review_id = $1`,[id])
    let result = await Promise.all([reviewTable, commentCount])
    result[0].rows[0].comment_count = result[1].rows[0].count
    return result[0]
}