const db = require("../db")

exports.fetchCommentsForRevId = async (id) => {
   const cols = `comment_id, comments.votes, comments.created_at, author, reviews.review_body AS body`
   return await db.query(
      `SELECT ${cols} FROM comments
      LEFT JOIN reviews ON comments.review_id = reviews.review_id
      WHERE comments.review_id = $1
      `, [id])
}

exports.updateCommentsForRevId = async (id, username, body) => {
   return await db.query(`
      INSERT INTO comments(review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;
   `, [id, username, body])
}
exports.removeCommentForComID = async (id) => {
   return await db.query(`
   DELETE FROM comments
   WHERE comment_id = $1
   RETURNING *;
   `, [id])
}
exports.fetchCommentWithID = async (id) => {
   return await db.query(`
   SELECT * FROM comments
   WHERE comment_id = $1
   `, [id])
}