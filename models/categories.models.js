const db = require("../db")

exports.fetchCats = async () => {
    return await db.query('SELECT * FROM categories')
}