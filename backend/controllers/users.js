const Users = require('../models/Users');
const mongoose = require('mongoose');

const handleErrors = (err) => {
    let errors = { email: "", password: "", name: "" };

    if (err.code === 11000) {
        errors.email = 'That email has already been registered';
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id)
                                .populate('followers', 'name')
                                .populate('following', 'name')
                                .populate('saved_recipes', 'title picture time rating difficulty')
                                .populate('created_recipes', 'title picture time rating difficulty');

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            res.status(201).json({
                success: true,
                count: user.length,
                data: user
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const user = await Users.findById(res.locals.currentUser._id)
                                .populate('followers', 'name')
                                .populate('following', 'name')
                                .populate('saved_recipes', 'title picture time rating difficulty')
                                .populate('created_recipes', 'title picture time rating difficulty');

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'No User Found.'
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: true,
                    count: user.length,
                    data: user
                })
            }
        } else {
            res.send({ user: false });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const user = await Users.findById(res.locals.currentUser._id);

            switch (req.query.update) {
                case "created":
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        const updatedRecipes = user.created_recipes.concat(req.body.id);
        
                        user.picture = user.picture;
                        user.followers = user.followers;
                        user.following = user.following;
                        user.created_recipes = updatedRecipes;
                        user.saved_recipes = user.saved_recipes;
                        user.name = user.name;
                        user.email = user.email;
                        user.password = user.password;
                        user.date = user.date;
        
                        await user.save();
        
                        res.status(201).json({
                            success: true,
                            data: user
                        })
                    }
                    break;
                case "follower":
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        const updatedFollowers = user.followers.concat(req.body.id);
        
                        user.picture = user.picture;
                        user.followers = updatedFollowers;
                        user.following = user.following;
                        user.created_recipes = user.created_recipes;
                        user.saved_recipes = user.saved_recipes;
                        user.name = user.name;
                        user.email = user.email;
                        user.password = user.password;
                        user.date = user.date;
        
                        await user.save();
        
                        res.status(201).json({
                            success: true,
                            data: user
                        })
                    }
                    break;
                case "following":
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        const updatedFollowing = user.following.concat(req.body.id);
        
                        user.picture = user.picture;
                        user.followers = user.followers;
                        user.following = updatedFollowing;
                        user.created_recipes = user.created_recipes;
                        user.saved_recipes = user.saved_recipes;
                        user.name = user.name;
                        user.email = user.email;
                        user.password = user.password;
                        user.date = user.date;
        
                        await user.save();
        
                        res.status(201).json({
                            success: true,
                            data: user
                        })
                    }
                    break;
                case "saved":
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        const updatedSaved = user.saved_recipes.concat(req.body.id);
        
                        user.picture = user.picture;
                        user.followers = user.followers;
                        user.following = user.following;
                        user.created_recipes = user.created_recipes;
                        user.saved_recipes = updatedSaved;
                        user.name = user.name;
                        user.email = user.email;
                        user.password = user.password;
                        user.date = user.date;
        
                        await user.save();
        
                        res.status(201).json({
                            success: true,
                            data: user
                        })
                    }
                    break;
                case "all":
                    const { name, email, password, date, picture, followers, following, created_recipes, saved_recipes } = req.body;

                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        user.picture = picture;
                        user.followers = followers;
                        user.following = following;
                        user.created_recipes = created_recipes;
                        user.saved_recipes = saved_recipes;
                        user.name = name;
                        user.email = email;
                        user.password = password;
                        user.date = date;

                        await user.save();

                        res.status(201).json({
                            success: true,
                            data: user
                        })
                    }
                    break;
                default:
                    break;
            }
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            await user.remove();

            res.status(201).json({
                success: true,
                data: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getFeedHome = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const feedRecipes = await Users.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
                    }
                },
                { 
                    $lookup: { 
                        from: 'users', 
                        localField: 'following', 
                        foreignField: '_id', 
                        as: 'followingUsers' 
                    }
                }, {
                    $unwind: {
                        path: '$feedRecipes',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: 'recipes',
                        localField: 'followingUsers.created_recipes',
                        foreignField: '_id',
                        as: 'recipe',
                    }
                }, {
                    $unwind: '$recipe'
                }, {
                    $project: {
                        _id: 0,
                        'recipe.title': 1,
                        'recipe.picture': 1,
                        'recipe.time': 1,
                        'recipe.rating': 1,
                        'recipe.difficulty': 1,
                        'recipe.createdAt': 1
                    }
                }, { 
                    $sort: { 
                        'recipe.createdAt': -1
                    } 
                }
            ]).limit(3);

            res.status(201).json({
                success: true,
                count: feedRecipes.length,
                user: true,
                data: feedRecipes
            })
        } else {
            res.send({ user: false });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getFeed = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const feedRecipes = await Users.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
                    }
                },
                { 
                    $lookup: { 
                        from: 'users', 
                        localField: 'following', 
                        foreignField: '_id', 
                        as: 'followingUsers' 
                    }
                }, {
                    $unwind: {
                        path: '$feedRecipes',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: 'recipes',
                        localField: 'followingUsers.created_recipes',
                        foreignField: '_id',
                        as: 'recipe',
                    }
                }, {
                    $unwind: '$recipe'
                }, {
                    $project: {
                        _id: 0,
                        'recipe.title': 1,
                        'recipe.picture': 1,
                        'recipe.time': 1,
                        'recipe.rating': 1,
                        'recipe.difficulty': 1,
                        'recipe.createdAt': 1,
                        'recipe.page': { $lt: ['$recipe.createdAt', new Date(req.query.createdAt)] }
                    }
                }, {
                    $match: {
                        'recipe.page': true
                    }
                }, { 
                    $sort: { 
                        'recipe.createdAt': -1
                    } 
                }
            ]).limit(20);
    
            res.status(201).json({
                success: true,
                count: feedRecipes.length,
                user: true,
                data: feedRecipes
            })
        } else {
            res.send({ user: false });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}