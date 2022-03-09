const format = require('pg-format')
const db = require("../db");

exports.fetchUsers = async () => {
   return await db.query(`
   SELECT username FROM users
   `)
}
exports.fetchUserWithId = async (id) => {
   const result = await db.query(`
   SELECT * FROM users
   WHERE username = $1
   `, [id])
   if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" })
   } else {
      return result
   }
}
exports.addUser = async (username, name, url) => {
   const values = [username, name, url]
   const queryString = format(`
   INSERT INTO users
	(username, name, avatar_url)
	VALUES (%L) 
	RETURNING *;
	`, values)
   return await db.query(queryString)
}