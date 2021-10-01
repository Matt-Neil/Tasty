const express = require('express');
const router = express.Router();
const { getChat, getChats, addMessage, getMessages, addChat } = require('../controllers/chats');

router.route('/:id/messages').get(getMessages);

router.route('/:id').get(getChat).put(addMessage);

router.route('/').get(getChats).post(addChat);

module.exports = router