const { removeListener } = require('../db')
const db = require('../db')
const { hasReview, validInput } = require('../utils/utils')

exports.fetchReviews = async (sortedBy = 'created_at', order = 'asc', category) => {
	let cols = `owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count`
	let queryString = `SELECT ${cols} FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`
	if (!validInput(sortedBy, order, category)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' })
	}
	const queryValues = []
	if (category != undefined) {
		queryString += ` WHERE category = $1`
		queryValues.push(category)
	}
	queryString += ` GROUP BY reviews.review_id ORDER BY ${sortedBy} ${order}`
	return await db.query(queryString, queryValues)
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
