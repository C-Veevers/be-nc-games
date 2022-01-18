const express = require('express');
categoryRouter = express.Router()
const { getCats } = require('../controllers/categories.controller');

categoryRouter.route('/')
    .get(getCats)

module.exports = categoryRouter