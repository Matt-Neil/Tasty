const express = require('express');
const router = express.Router();
const { getLatest, getPopular, getDinner, getDessert, getDinnerShort, getDessertShort, getDiscover, 
    getRecipe, updateRecipe, deleteRecipe, addRecipe, getIngredient } = require('../controllers/recipes');

router.route('/latest').get(getLatest);

router.route('/popular').get(getPopular);

router.route('/dinner').get(getDinner);

router.route('/dessert').get(getDessert);

router.route('/short/dinner').get(getDinnerShort);

router.route('/short/dessert').get(getDessertShort);

router.route('/discover').get(getDiscover);

router.route('/ingredient/:id').get(getIngredient);

router.route('/recipe').post(addRecipe);

router.route('/recipe/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;