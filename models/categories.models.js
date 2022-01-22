const format = require("pg-format")
const db = require("../db")

exports.fetchCategory = async () => {
    return await db.query('SELECT * FROM categories')
}
exports.insertCategory = async (slug, description) => {
    const values = [slug, description]
    const queryString = format(`
    INSERT INTO categories 
    (slug, description) 
    VALUES (%L) 
    RETURNING *;`, values)
    return await db.query(queryString)
}