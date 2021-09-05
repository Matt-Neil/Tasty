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
        const user = await Users.findById(req.params.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            if (Object.entries(res.locals.currentUser._id).toString() === Object.entries(mongoose.Types.ObjectId(req.params.id)).toString()) {
                res.status(201).json({
                    success: true,
                    user: true,
                    data: user
                })
            } else if (res.locals.currentUser.following.some(i => Object.entries(i._id).toString() === Object.entries(user._id).toString())) {
                res.status(201).json({
                    success: true,
                    user: false,
                    followed: true,
                    data: user
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: false,
                    followed: false,
                    data: user
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getUserFollowers = async (req, res, next) => {
    try {
        const followers = await Users.aggregate([
            { 
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            { 
                $lookup: { 
                    from: 'users', 
                    localField: 'followers', 
                    foreignField: '_id', 
                    as: 'followerUsers' 
                }
            }, {
                $unwind: '$followerUsers'
            }, {
                $project: {
                    _id: 0,
                    'followerUsers._id': 1,
                    'followerUsers.name': 1,
                    'followerUsers.picture': 1,
                    'followerUsers.page': { $lt: ['$followerUsers._id', mongoose.Types.ObjectId(req.query.id)] }
                    }
            }, {
                $match: {
                    'followerUsers.page': true
                }
            }, { 
                $sort: { 
                    'followerUsers._id': -1
                } 
            }
        ]).limit(30);

        if (!followers) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            res.status(201).json({
                success: true,
                count: followers.length,
                data: followers
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.updateUserFollowers = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);

        let updatedFollowers = user.followers;

        if (req.body.remove) {
            updatedFollowers.splice(user.followers.indexOf(res.locals.currentUser._id), 1);
        } else {
            updatedFollowers = updatedFollowers.concat(res.locals.currentUser._id);
        }

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
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getUserFollowing = async (req, res, next) => {
    try {
        const following = await Users.aggregate([
            { 
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
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
                $unwind: '$followingUsers'
            }, {
                $project: {
                    _id: 0,
                    'followingUsers._id': 1,
                    'followingUsers.name': 1,
                    'followingUsers.picture': 1,
                    'followingUsers.page': { $lt: ['$followingUsers._id', mongoose.Types.ObjectId(req.query.id)] }
                    }
            }, {
                $match: {
                    'followingUsers.page': true
                }
            }, { 
                $sort: { 
                    'followingUsers._id': -1
                } 
            }
        ]).limit(30);

        if (!following) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            res.status(201).json({
                success: true,
                count: following.length,
                data: following
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getUserCreated = async (req, res, next) => {
    try {
        const created = await Users.aggregate([
            { 
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            { 
                $lookup: { 
                    from: 'recipes', 
                    localField: 'created_recipes', 
                    foreignField: '_id', 
                    as: 'createdRecipes' 
                }
            }, {
                $unwind: '$createdRecipes'
            }, {
                $project: {
                    _id: 0,
                    'createdRecipes._id': 1,
                    'createdRecipes.title': 1,
                    'createdRecipes.picture': 1,
                    'createdRecipes.time': 1,
                    'createdRecipes.rating': 1,
                    'createdRecipes.difficulty': 1,
                    'createdRecipes.createdAt': 1,
                    'createdRecipes.page': { $lt: ['$createdRecipes.createdAt', new Date(req.query.date)] }
                    }
            }, {
                $match: {
                    'createdRecipes.page': true
                }
            }, { 
                $sort: { 
                    'createdRecipes.createdAt': -1
                } 
            }
        ]).limit(20);

        if (!created) {
            res.status(404).json({
                success: false,
                error: 'No User Found.'
            })
        } else {
            res.status(201).json({
                success: true,
                count: created.length,
                data: created
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
            const user = await Users.findById(res.locals.currentUser._id);

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

exports.getProfileFollowers = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const followers = await Users.aggregate([
                { 
                    $match: {
                        _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
                    }
                },
                { 
                    $lookup: { 
                        from: 'users', 
                        localField: 'followers', 
                        foreignField: '_id', 
                        as: 'followerUsers' 
                    }
                }, {
                    $unwind: '$followerUsers'
                }, {
                    $project: {
                        _id: 0,
                        'followerUsers._id': 1,
                        'followerUsers.name': 1,
                        'followerUsers.picture': 1,
                        'followerUsers.page': { $lt: ['$followerUsers._id', mongoose.Types.ObjectId(req.query.id)] }
                        }
                }, {
                    $match: {
                        'followerUsers.page': true
                    }
                }, { 
                    $sort: { 
                        'followerUsers._id': -1
                    } 
                }
            ]).limit(30);

            if (!followers) {
                res.status(404).json({
                    success: false,
                    error: 'No User Found.'
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: true,
                    count: followers.length,
                    data: followers
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

exports.getProfileFollowing = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const following = await Users.aggregate([
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
                    $unwind: '$followingUsers'
                }, {
                    $project: {
                        _id: 0,
                        'followingUsers._id': 1,
                        'followingUsers.name': 1,
                        'followingUsers.picture': 1,
                        'followingUsers.page': { $lt: ['$followingUsers._id', mongoose.Types.ObjectId(req.query.id)] }
                        }
                }, {
                    $match: {
                        'followingUsers.page': true
                    }
                }, { 
                    $sort: { 
                        'followingUsers._id': -1
                    } 
                }
            ]).limit(30);

            if (!following) {
                res.status(404).json({
                    success: false,
                    error: 'No User Found.'
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: true,
                    count: following.length,
                    data: following
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

exports.getProfileCreated = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const created = await Users.aggregate([
                { 
                    $match: {
                        _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
                    }
                },
                { 
                    $lookup: { 
                        from: 'recipes', 
                        localField: 'created_recipes', 
                        foreignField: '_id', 
                        as: 'createdRecipes' 
                    }
                }, {
                    $unwind: '$createdRecipes'
                }, {
                    $project: {
                        _id: 0,
                        'createdRecipes._id': 1,
                        'createdRecipes.title': 1,
                        'createdRecipes.picture': 1,
                        'createdRecipes.time': 1,
                        'createdRecipes.rating': 1,
                        'createdRecipes.difficulty': 1,
                        'createdRecipes.createdAt': 1,
                        'createdRecipes.page': { $lt: ['$createdRecipes.createdAt', new Date(req.query.date)] }
                        }
                }, {
                    $match: {
                        'createdRecipes.page': true
                    }
                }, { 
                    $sort: { 
                        'createdRecipes.createdAt': -1
                    } 
                }
            ]).limit(20);

            if (!created) {
                res.status(404).json({
                    success: false,
                    error: 'No User Found.'
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: true,
                    count: created.length,
                    data: created
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

exports.getProfileSaved = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const saved = await Users.aggregate([
                { 
                    $match: {
                        _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
                    }
                },
                { 
                    $lookup: { 
                        from: 'recipes', 
                        localField: 'saved_recipes', 
                        foreignField: '_id', 
                        as: 'savedRecipes' 
                    }
                }, {
                    $unwind: '$savedRecipes'
                }, {
                    $project: {
                        _id: 0,
                        'savedRecipes._id': 1,
                        'savedRecipes.title': 1,
                        'savedRecipes.picture': 1,
                        'savedRecipes.time': 1,
                        'savedRecipes.rating': 1,
                        'savedRecipes.difficulty': 1,
                        'savedRecipes.createdAt': 1,
                        'savedRecipes.page': { $lt: ['$savedRecipes.createdAt', new Date(req.query.date)] }
                        }
                }, {
                    $match: {
                        'savedRecipes.page': true
                    }
                }, { 
                    $sort: { 
                        'savedRecipes.createdAt': -1
                    } 
                }
            ]).limit(20);

            if (!saved) {
                res.status(404).json({
                    success: false,
                    error: 'No User Found.'
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: true,
                    count: saved.length,
                    data: saved
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

exports.updateProfile = async (req, res, next) => {
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
                case "following":
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        let updatedFollowing = user.following;

                        if (req.body.remove) {
                            updatedFollowing.splice(user.following.indexOf(req.body.id), 1);
                        } else {
                            updatedFollowing = updatedFollowing.concat(req.body.id);
                        }
        
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
                        let updatedSaved = user.saved_recipes;

                        if (req.body.remove) {
                            updatedSaved.splice(user.saved_recipes.indexOf(req.body.id), 1);
                        } else {
                            updatedSaved = updatedSaved.concat(req.body.id);
                        }

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
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            error: 'No User Found.'
                        })
                    } else {
                        user.picture = req.body.picture;
                        user.followers = user.followers;
                        user.following = user.following;
                        user.created_recipes = user.created_recipes;
                        user.saved_recipes = user.saved_recipes;
                        user.name = user.name;
                        user.email = user.email;
                        user.password = req.body.password;
                        user.date = user.date;

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

exports.deleteProfile = async (req, res, next) => {
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

exports.getFeedShort = async (req, res, next) => {
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
                        'recipe._id': 1
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
                        'recipe._id': 1,
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
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}