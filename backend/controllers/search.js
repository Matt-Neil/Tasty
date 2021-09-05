const Recipes = require('../models/Recipes');
const Users = require('../models/Users');
const mongoose = require('mongoose');

exports.getSearchRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipes.aggregate([
            { 
                $match: { 
                    $text: { 
                        $search: req.query.phrase
                    },
                    _id: {
                        $lt: mongoose.Types.ObjectId(req.query.id)
                    }
                }
            }, {
                $sort: { 
                    '_id': -1
                } 
            }
        ]).limit(20);

        return res.status(201).json({
            success: true,
            count: recipes.length,
            data: recipes
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getSearchUsers = async (req, res, next) => {
    try {
        const users = await Users.aggregate([
            { 
                $match: { 
                    $text: { 
                        $search: req.query.phrase
                    },
                    _id: {
                        $lt: mongoose.Types.ObjectId(req.query.id)
                    }
                }
            }, {
                $sort: { 
                    '_id': -1
                } 
            }
        ]).limit(30);

        return res.status(201).json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}