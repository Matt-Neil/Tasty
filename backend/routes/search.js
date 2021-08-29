const express = require('express');
const router = express.Router();
const { getSearchUsers, getSearchRecipes } = require('../controllers/search');

router.route('/users').get(getSearchUsers);

router.route('/recipes').get(getSearchRecipes);

module.exports = router;