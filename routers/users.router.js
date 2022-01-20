const express = require('express');
userRouter = express.Router()
const { getUsers, getUserById } = require('../controllers/users.controller');

userRouter.route('/')
   .get(getUsers)
userRouter.route('/:userId')
   .get(getUserById)

module.exports = userRouter