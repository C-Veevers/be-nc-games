const express = require('express');
categoryRouter = express.Router()
const { getCats, postCats } = require('../controllers/categories.controller');

categoryRouter.route('/')
    .get(getCats)
    .post(postCats)

module.exports = categoryRouter