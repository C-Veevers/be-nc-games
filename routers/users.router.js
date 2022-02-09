const express = require('express');
userRouter = express.Router()
const { getUsers, getUserById, saveUser } = require('../controllers/users.controller');

userRouter.route('/')
   .get(getUsers)
   .post(saveUser)
userRouter.route('/:userId')
   .get(getUserById)

module.exports = userRouter