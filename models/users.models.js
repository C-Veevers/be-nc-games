const db = require("../db");

exports.fetchUsers = async () => {
   return await db.query(`
   SELECT * FROM users
   `)
}