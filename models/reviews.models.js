const db = require("../db")

exports.fetchReviews = async ()=>{
    return await db.query('SELECT * FROM reviews')

}