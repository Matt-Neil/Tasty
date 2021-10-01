const Chats = require('../models/Chats');
const mongoose = require('mongoose');

const handleErrors = (err) => {
    let errors = { rating: "", title: "", servings: "", description: "", difficulty: "", meal: "" };

    if (err.message.includes('Recipe validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

exports.getChat = async (req, res, next) => {
    try {
        const chat = await Chats.findById(req.params.id, 'user1 user2')
                                .populate('user1', 'name _id')
                                .populate('user2', 'name _id');

        res.status(201).json({
            success: true,
            data: chat
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Chats.aggregate([
            { 
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            }, {
                $unwind: '$messages'
            }, {
                $project: {
                    _id: 0,
                    'messages.message': 1,
                    'messages.sender': 1,
                    'messages.createdAt': 1,
                    'messages.page': { $lt: ['$messages.createdAt', new Date(req.query.date)] }
                }
            }, {
                $match: {
                    'messages.page': true
                }
            }, { 
                $sort: { 
                    'messages.createdAt': -1
                } 
            }, {
                $project: {
                    _id: 0,
                    'messages.message': 1,
                    'messages.sender': 1,
                }
            }
        ]).limit(20);
        
        res.status(201).json({
            success: true,
            data: messages
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getChats = async (req, res, next) => {
    try {
        const chat = await Chats.find({ $or: [ { user1: mongoose.Types.ObjectId(res.locals.currentUser.id) }, { user2: mongoose.Types.ObjectId(res.locals.currentUser.id) } ] }, 'user1 user2 updatedAt')
                                .populate('user1', 'name _id')
                                .populate('user2', 'name _id')
                                .sort({ updatedAt: 1 });
        
        res.status(201).json({
            success: true,
            data: chat
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.addMessage = async (req, res, next) => {
    try {
        const chat = await Chats.findById(req.params.id);

        if (!chat) {
            res.status(404).json({
                success: false,
                error: "No Chat Found."
            })
        } else {
            const messages = chat.messages
            const newMessage = {
                message: req.body.message,
                sender: res.locals.currentUser._id
            }

            messages.push(newMessage)

            chat.participants = chat.participants;
            chat.messages = messages;

            await chat.save();

            res.status(201).json({
                success: true,
                data: newMessage
            })
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            success: false,
            errors: errors
        });
    }
}

exports.addChat = async (req, res, next) => {
    try {
        const chat = await Chats.find({ $or: [ { user1: mongoose.Types.ObjectId(res.locals.currentUser.id) }, { user2: mongoose.Types.ObjectId(res.locals.currentUser.id) } ] }, 'user1 user2 updatedAt')
                                .populate('user1', 'name _id')
                                .populate('user2', 'name _id')
                                .sort({ updatedAt: 1 });
        
        res.status(201).json({
            success: true,
            data: chat
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}