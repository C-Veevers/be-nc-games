const format = require('pg-format')
const db = require('../db')
const { hasReview, validInput, getCats } = require('../utils/utils')

exports.fetchReviews = async (sortedBy = 'created_at', order = 'asc', category, limit, page = 0) => {
	const queryValues = [limit, (limit * page)]
	let cols = `owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count`
	let queryString = `SELECT ${cols} FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`

	if (!validInput(sortedBy, order, category, limit, page)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' })
	}

	if (category != undefined) {
		queryString += ` WHERE category = $3`
		queryValues.push(category)

	}
	queryString += ` GROUP BY reviews.review_id ORDER BY ${sortedBy} ${order} LIMIT $1 OFFSET $2`
	let result = await Promise.all([db.query(queryString, queryValues), db.query('SELECT COUNT(*) FROM reviews')])
	result[0].rows.push({ total_count: result[1].rows[0].count })
	return result[0]
}

exports.fetchReviewById = async (id) => {
	let cols = `owner, title, reviews.review_id, review_body, designer, review_img_url, 
	category, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count`

	let queryString = `SELECT ${cols} FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`

	if (!await hasReview(id)) {
		return Promise.reject({ status: 404, msg: 'Not Found' })
	} else {
		queryString += ` WHERE reviews.review_id = $1 GROUP BY reviews.review_id`
		return await db.query(queryString, [id])
	}
}

exports.updateReview = async (id, inc) => {
	let queryString = `UPDATE reviews SET votes = votes+$1 WHERE review_id = $2 RETURNING *;`
	let input = [inc, id]
	return await db.query(queryString, input)
}

exports.insertReview = async (owner, title, review_body, designer, category, review_img_url) => {
	let validCat = await getCats()
	if (!validCat.includes(category)) {
		return Promise.reject({ status: 400, msg: "Bad Request" })
	}
	const values = [owner, title, review_body, designer, category, review_img_url]
	const queryString = format(`
	INSERT INTO reviews 
	(owner, title, review_body, designer, category, review_img_url)
	VALUES (%L) 
	RETURNING *;
	`, values)
	return await db.query(queryString)
}
