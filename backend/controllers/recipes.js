const Recipes = require('../models/Recipes');
const Users = require('../models/Users');

const handleErrors = (err) => {
    let errors = { time: "", min: "", hr: "", servings: "", ingredients: "", ingredient: "", measurement: "", unit: "",
                    rating: "", title: "", steps: "", servings: "", description: "", difficulty: "", meal: "" };

    if (err.message.includes('Recipe validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

exports.getRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipes.findById(req.params.id)
                                    .populate('creator', 'name')
                                    .populate('author', 'name');
    
        if (!recipe) {
            res.status(404).json({
                success: false,
                error: "No recipe Found."
            })
        } else {
            const related = await Recipes.find({ _id: { $ne: recipe._id }, $or: [{ meal: recipe.meal,  $text: { $search: recipe.title }}] })
                                        .limit(3);

            if (res.locals.currentUser) {
                if (res.locals.currentUser.created_recipes.some(i => Object.entries(i._id).toString() === Object.entries(recipe._id).toString())) {
                    res.status(201).json({
                        success: true,
                        user: true,
                        data: {
                            recipe,
                            related
                        }
                    })
                } else {
                    res.status(201).json({
                        success: true,
                        user: false,
                        data: {
                            recipe,
                            related
                        }
                    })
                }
            } else {
                res.status(201).json({
                    success: true,
                    user: false,
                    data: {
                        recipe,
                        related
                    }
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

exports.addRecipe = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const recipe = await Recipes.create(req.body);

            res.status(201).json({
                success: true,
                user: true,
                data: recipe._id
            })
        } else {
            res.send({ user: false })
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

exports.updateRecipe = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const recipe = await Recipes.findById(req.params.id);
        
            if (req.query.update === "all") {
                const { title, picture, ingredients, reviews, steps, time, rating, meal, servings, description, difficulty, date, creator } = req.body;
        
                if (!recipe) {
                    res.status(404).json({
                        success: false,
                        error: "No Recipe Found."
                    })
                } else {
                    recipe.title = title;
                    recipe.ingredients = ingredients;
                    recipe.reviews = reviews;
                    recipe.picture = picture;
                    recipe.steps = steps;
                    recipe.time = time;
                    recipe.meal = meal;
                    recipe.rating = rating;
                    recipe.servings = servings;
                    recipe.description = description;
                    recipe.difficulty = difficulty;
                    recipe.date = date;
                    recipe.creator = creator;
        
                    await recipe.save();
        
                    res.status(201).json({
                        success: true,
                        data: recipe
                    })
                }
            } else {
                if (!recipe) {
                    res.status(404).json({
                        success: false,
                        error: "No Recipe Found."
                    })
                } else {
                    let updatedRating = 0;
                    const updatedReviews = recipe.reviews.concat(req.body.review);

                    {updatedReviews.map(review => {
                        updatedRating = updatedRating + review.rating;
                    })}
                    updatedRating = updatedRating / updatedReviews.length;
        
                    recipe.title = recipe.title;
                    recipe.ingredients = recipe.ingredients;
                    recipe.reviews = updatedReviews;
                    recipe.picture = recipe.picture;
                    recipe.steps = recipe.steps;
                    recipe.time = recipe.time;
                    recipe.meal = recipe.meal;
                    recipe.rating = updatedRating;
                    recipe.servings = recipe.servings;
                    recipe.description = recipe.description;
                    recipe.difficulty = recipe.difficulty;
                    recipe.date = recipe.date;
                    recipe.creator = recipe.creator;
        
                    await recipe.save();
        
                    res.status(201).json({
                        success: true,
                        data: recipe
                    })
                }
            }
        } else {
            res.send({ user: false })
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

exports.deleteRecipe = async (req, res, next) => {
    try {
        if (res.locals.currentUser) {
            const recipe = await Recipes.findById(req.params.id);
            const creator = await Users.findById(recipe.creator);
            const users = await Users.find({ saved_recipes: { $in: [req.params.id] } });

            if (!recipe) {
                res.status(404).json({
                    success: false,
                    error: "No recipe Found."
                })
            } else {
                creator.created_recipes.splice(creator.created_recipes.indexOf(req.params.id), 1);

                creator.picture = creator.picture;
                creator.followers = creator.followers;
                creator.following = creator.following;
                creator.created_recipes = creator.created_recipes;
                creator.saved_recipes = creator.saved_recipes;
                creator.name = creator.name;
                creator.email = creator.email;
                creator.password = creator.password;
                creator.date = creator.date;

                {users.map(async user => {
                    user.saved_recipes.splice(user.saved_recipes.indexOf(req.params.id), 1);

                    user.picture = user.picture;
                    user.followers = user.followers;
                    user.following = user.following;
                    user.created_recipes = user.created_recipes;
                    user.saved_recipes = user.saved_recipes;
                    user.name = user.name;
                    user.email = user.email;
                    user.password = user.password;
                    user.date = user.date;

                    await user.save();
                })}

                await creator.save();
                await recipe.remove();

                res.status(201).json({
                    success: true,
                    data: {}
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

exports.getDiscover = async (req, res, next) => {
    try {
        const discoverRecipes = await Recipes.aggregate([{ $sample: { size: 5 } }]);

        res.status(201).json({
            success: true,
            count: discoverRecipes.length,
            data: discoverRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getLatest = async (req, res, next) => {
    try {
        const latestRecipes = await Recipes.find({}, 'title picture time rating difficulty')
                                           .sort({ createdAt: -1 })
                                           .limit(20);

        res.status(201).json({
            success: true,
            count: latestRecipes.length,
            data: latestRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getPopular = async (req, res, next) => {
    try {
        const popularRecipes = await Recipes.find({}, 'title picture time rating difficulty')
                                            .sort({ rating: -1 })
                                            .limit(20);

        res.status(201).json({
            success: true,
            count: popularRecipes.length,
            data: popularRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getDinner = async (req, res, next) => {
    try {
        const dinnerRecipes = await Recipes.find({ $and: [{ meal: 'Dinner' }, { createdAt: { $lt: new Date(req.query.createdAt) } }] }, 'title picture time rating difficulty createdAt')
                                           .sort({ createdAt: -1 })
                                           .limit(20);

        res.status(201).json({
            success: true,
            count: dinnerRecipes.length,
            data: dinnerRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getDessert = async (req, res, next) => {
    try {
        const dessertRecipes = await Recipes.find({ $and: [{ meal: 'Dessert' }, { createdAt: { $lt: new Date(req.query.createdAt) } }] }, 'title picture time rating difficulty createdAt')
                                            .sort({ createdAt: -1 })
                                            .limit(20);

        res.status(201).json({
            success: true,
            count: dessertRecipes.length,
            data: dessertRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getDinnerHome = async (req, res, next) => {
    try {
        const dinnerRecipes = await Recipes.find({ meal: 'Dinner' }, 'title picture time rating difficulty')
                                           .sort({ createdAt: -1 })
                                           .limit(5);

        res.status(201).json({
            success: true,
            count: dinnerRecipes.length,
            data: dinnerRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getDessertHome = async (req, res, next) => {
    try {
        const dessertRecipes = await Recipes.find({ meal: 'Dessert' }, 'title picture time rating difficulty')
                                            .sort({ createdAt: -1 })
                                            .limit(5);

        res.status(201).json({
            success: true,
            count: dessertRecipes.length,
            data: dessertRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

exports.getIngredient = async (req, res, next) => {
    try {
        const ingredientRecipes = await Recipes.find({ $and: [{ $text: { $search: req.params.id } }, { createdAt: { $lt: new Date(req.query.createdAt) } }] }, 'title picture time rating difficulty createdAt')
                                               .sort({ createdAt: -1 })
                                               .limit(20);

        res.status(201).json({
            success: true,
            count: ingredientRecipes.length,
            data: ingredientRecipes
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}