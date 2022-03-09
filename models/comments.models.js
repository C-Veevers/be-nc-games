const db = require("../db")
const { validInput } = require("../utils/utils")

exports.fetchCommentsForRevId = async (id, limit, p) => {
   if (!validInput('review_id', 'asc', undefined, limit, p)) {
      return Promise.reject({ status: 400, msg: "Bad Request" })
   }
   let values = [id, limit, (limit * p)]
   const cols = `comment_id, comments.votes, comments.created_at, author, comments.body AS body`
   const result = await db.query(
      `SELECT ${cols} FROM comments
      LEFT JOIN reviews ON comments.review_id = reviews.review_id
      WHERE comments.review_id = $1 
      LIMIT $2 
      OFFSET $3
      `, values)
   if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" })
   } else {
      return result
   }
}
//
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
   const result = await db.query(`
   SELECT * FROM comments
   WHERE comment_id = $1
   `, [id])
   if (result.rowCount === 0) {
      return Promise.reject({ status: 204 })
   } else {
      return result
   }
}