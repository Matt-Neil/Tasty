const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { _id : false, timestamps: true });

const ChatsSchema = new mongoose.Schema({
    user1: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: { 
        type: [MessagesSchema], 
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Chat', ChatsSchema);