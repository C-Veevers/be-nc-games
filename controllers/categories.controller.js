const { fetchCategory, insertCategory } = require("../models/categories.models")

exports.getCategory = (req, res, next) => {
    fetchCategory()
        .then(categories => {
            res.status(200)
            res.send({ categories: categories.rows })
        })
        .catch(err => next(err))
}
exports.postCategory = (req, res, next) => {
    const { slug, description } = req.body
    insertCategory(slug, description)
        .then(category => {
            res.status(201)
            res.send({ category: category.rows })
        })
        .catch(err => next(err))
}