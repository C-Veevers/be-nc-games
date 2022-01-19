const { fetchCommentsForRevId, updateCommentsForRevId } = require("../models/comments.models")

exports.getCommentsByRevId = (req, res, next) => {
   const { revId } = req.params
   fetchCommentsForRevId(revId).then(comments => {
      if (comments.rowCount == 0) {
         return Promise.reject({ status: 404, msg: "Not Found" })
      } else {
         res.status(200)
         res.send({ comments: comments.rows })
      }
   }).catch(err => next(err))
}
exports.postCommentByRevId = (req, res, next) => {
   const { revId } = req.params
   const { username, body } = req.body
   updateCommentsForRevId(revId, username, body).then(comment => {
      res.status(200)
      res.send({ comment: comment.rows })
   }).catch(err => next(err))
}