const express = require('express');
categoryRouter = express.Router()
const { getCategory, postCategory } = require('../controllers/categories.controller');

categoryRouter.route('/')
    .get(getCategory)
    .post(postCategory)

module.exports = categoryRouter