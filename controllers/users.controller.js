const { fetchUsers, fetchUserWithId, addUser } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
   fetchUsers().then(users => {
      res.status(200)
      res.send({ users: users.rows })
   }).catch(err => next(err))
}
exports.getUserById = (req, res, next) => {
   const { userId } = req.params
   fetchUserWithId(userId).then(user => {
      res.status(200)
      res.send({ user: user.rows })
   }).catch(err => next(err))
}
exports.saveUser = (req, res, next) => {
   const { username, name, avatar_url } = req.body
   addUser(username, name, avatar_url).then(user => {
      res.status(201)
      res.send({ user: user.rows })
   })
}