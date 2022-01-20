const { fetchCommentsForRevId, updateCommentsForRevId, removeCommentForComID, fetchCommentWithID } = require("../models/comments.models")

exports.getCommentsByRevId = (req, res, next) => {
   const { revId } = req.params
   const { limit = 10, p = 0 } = req.query
   fetchCommentsForRevId(revId, limit, p).then(comments => {
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
exports.deleteCommentById = (req, res, next) => {
   const { comId } = req.params
   removeCommentForComID(comId).then(comment => {
      res.status(200)
      res.send({ comment: comment.rows })
   }).catch(err => next(err))
}
exports.getCommentById = (req, res, next) => {
   const { comId } = req.params
   fetchCommentWithID(comId).then(comment => {
      if (comment.rowCount == 0) {
         return Promise.reject({ status: 204 })
      } else {
         res.status(200)
         res.send({ comment: comment.rows })
      }
   }).catch(err => next(err))
}