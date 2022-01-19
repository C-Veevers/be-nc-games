const express = require('express');
commentRouter = express.Router();
const { deleteCommentById, getCommentById } = require('../controllers/comments.controller');


commentRouter.route('/:comId')
   .get(getCommentById)
   .delete(deleteCommentById)



module.exports = commentRouter