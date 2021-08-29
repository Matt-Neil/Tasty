const express = require('express');
const router = express.Router();
const { getUser, updateProfile, deleteProfile, getFeed, getFeedShort, getProfile, getProfileCreated, getProfileFollowers, getProfileFollowing,
    getProfileSaved, getUserCreated, getUserFollowers, getUserFollowing } = require('../controllers/users');

router.route('/feed').get(getFeed);

router.route('/profile').get(getProfile).put(updateProfile).delete(deleteProfile);

router.route('/profile/followers').get(getProfileFollowers);

router.route('/profile/following').get(getProfileFollowing);

router.route('/profile/saved').get(getProfileSaved);

router.route('/profile/created').get(getProfileCreated);

router.route('/short/feed').get(getFeedShort);

router.route('/:id/followers').get(getUserFollowers);

router.route('/:id/following').get(getUserFollowing);

router.route('/:id/created').get(getUserCreated);

router.route('/:id').get(getUser);

module.exports = router