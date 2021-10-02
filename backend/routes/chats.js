const express = require('express');
const router = express.Router();
const { getChat, getChats, addMessage, getMessages, addChat, getCheck, putChat } = require('../controllers/chats');

router.route('/:id/messages').get(getMessages);

router.route('/:id/check').get(getCheck);

router.route('/:id').get(getChat).put(addMessage);

router.route('/').get(getChats).post(addChat).put(putChat);

module.exports = router