const { fetchCats, insertCats } = require("../models/categories.models")

exports.getCats = (req, res, next) => {
    fetchCats()
        .then(categories => {
            res.status(200)
            res.send({ categories: categories.rows })
        })
        .catch(err => next(err))
}
exports.postCats = (req, res, next) => {
    const { slug, description } = req.body
    insertCats(slug, description)
        .then(cat => {
            res.status(201)
            res.send({ category: cat.rows })
        }).catch(err => next(err))
}