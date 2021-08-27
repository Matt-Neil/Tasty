const express = require('express');
const router = express.Router();
const { getUser, updateUser, deleteUser, getFeed, getFeedHome, getProfile } = require('../controllers/users');

router.route('/feed').get(getFeed);

router.route('/user').get(getProfile).put(updateUser).delete(deleteUser);

router.route('/home/feed').get(getFeedHome);

router.route('/:id').get(getUser);

module.exports = router