const db = require('../db')

exports.hasReview = async (id) => {
    let check = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    return check.rows.length ? true : false
}

exports.validInput = (sortedBy, order, category, limit, page) => {
    const orders = ['asc', 'desc']
    const cats = this.getCats()
    let sortable = [
        'owner',
        'title',
        'review_id',
        'category',
        'review_img_url',
        'created_at',
        'votes',
    ]
    if (isNaN(limit) || isNaN(page)) {
        return false
    }
    if (sortable.includes(sortedBy) && orders.includes(order.toLowerCase())) {
        if (category != undefined) {
            if (!cats.includes(category)) {
                return false
            }
        }
        return true
    }
    return false
}
exports.getCats = async () => {
    const validCat = []
    const cats = await db.query('SELECT slug FROM categories')
    cats.rows.forEach(cat => {
        validCat.push(cat.slug)
    })
    return validCat
}
