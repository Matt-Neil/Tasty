const express = require('express');
const router = express.Router();
const { getLatest, getPopular, getDinner, getDessert, getDinnerHome, getDessertHome, getDiscover, 
    getRecipe, updateRecipe, deleteRecipe, addRecipe, getIngredient } = require('../controllers/recipes');

router.route('/latest').get(getLatest);

router.route('/popular').get(getPopular);

router.route('/dinner').get(getDinner);

router.route('/dessert').get(getDessert);

router.route('/home/dinner').get(getDinnerHome);

router.route('/home/dessert').get(getDessertHome);

router.route('/discover').get(getDiscover);

router.route('/ingredient/:id').get(getIngredient);

router.route('/recipe/:id').get(getRecipe).post(addRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;