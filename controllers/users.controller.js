const { fetchUsers } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
   fetchUsers().then(users => {
      res.status(200)
      res.send({ users: users.rows })
   }).catch(err => next(err))

}