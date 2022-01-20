const db = require("../db");

exports.fetchUsers = async () => {
   return await db.query(`
   SELECT username FROM users
   `)
}
exports.fetchUserWithId = async (id) => {
   return await db.query(`
   SELECT * FROM users
   WHERE username = $1
   `, [id])
}