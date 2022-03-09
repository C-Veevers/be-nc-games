const { fetchCommentsForRevId, updateCommentsForRevId, removeCommentForComID, fetchCommentWithID } = require("../models/comments.models")

exports.getCommentsByRevId = (req, res, next) => {
   const { revId } = req.params
   const { limit = 10, p = 0 } = req.query
   fetchCommentsForRevId(revId, limit, p).then(comments => {
      res.status(200)
      res.send({ comments: comments.rows })

   }).catch(err => next(err))
}
exports.postCommentByRevId = (req, res, next) => {
   const { revId } = req.params
   const { username, body } = req.body
   updateCommentsForRevId(revId, username, body).then(comment => {
      res.status(201)
      res.send({ comment: comment.rows })
   }).catch(err => next(err))
}
exports.deleteCommentById = (req, res, next) => {
   const { comId } = req.params
   removeCommentForComID(comId).then(comment => {
      if (comment.rowCount === 0) {
         res.status(404)
         res.send({ msg: "that ID was not found" })
      } else {
         res.status(200)
         res.send({ comment: comment.rows })
      }
   }).catch(err => next(err))
}
exports.getCommentById = (req, res, next) => {
   const { comId } = req.params
   fetchCommentWithID(comId).then(comment => {
      res.status(200)
      res.send({ comment: comment.rows })
   }).catch(err => next(err))
}