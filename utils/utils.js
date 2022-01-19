const db = require('../db')

exports.hasReview = async (id) => {
    let check = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    return check.rows.length ? true : false
}

exports.validInput = (sortedBy, order, category) => {
    const orders = ['asc', 'desc']
    const cats = [
        'strategy',
        'hidden-roles',
        'dexterity',
        'push-your-luck',
        'roll-and-write',
        'deck-building',
        'engine-building',
        'euro game',
        'social deduction',
        "children's games",
    ]
    let sortable = [
        'owner',
        'title',
        'review_id',
        'category',
        'review_img_url',
        'created_at',
        'votes',
    ]
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
