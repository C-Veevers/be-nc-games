const { fetchCats } = require("../models/categories.models")

exports.getCats = (rev, res, next) => {
    fetchCats()
        .then(categories => {
            res.status(200)
            res.send({categories : categories.rows})
        })
        .catch(err => next(err))
}