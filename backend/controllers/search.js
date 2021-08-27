const Recipes = require('../models/Recipes');
const Users = require('../models/Users');

exports.getSearch = async (req, res, next) => {
    try {
        const phrase = req.query.phrase;
        // const recipes = await Recipes.aggregate([{ $or: [{ meal: recipe.meal,  $text: { $search: recipe.title },  $text: { $search: recipe.description }}] }])
        //                                  .limit(20);
        const recipes = await Recipes.aggregate([
            { 
                $match: { 
                    $text: { 
                        $search: phrase
                    } 
                }
            }, { 
                $sort: { 
                    '_id': -1
                } 
            }
        ]).limit(20);

        console.log(recipes)

        const users = []

        // const users = await Users.aggregate([
        //     { 
        //         $match: { 
        //             $text: { 
        //                 $search: phrase 
        //             } 
        //         } 
        //     }
        // ]).limit(20);

        return res.status(201).json({
            success: true,
            count: recipes.length + users.length,
            data: {
                recipes,
                users
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// const feedRecipes = await Users.aggregate([
//     {
//         $match: {
//             _id: mongoose.Types.ObjectId(res.locals.currentUser._id)
//         }
//     },
//     { 
//         $lookup: { 
//             from: 'users', 
//             localField: 'following', 
//             foreignField: '_id', 
//             as: 'followingUsers' 
//         }
//     }, {
//         $unwind: {
//             path: '$feedRecipes',
//             preserveNullAndEmptyArrays: true
//         }
//     }, {
//         $lookup: {
//             from: 'recipes',
//             localField: 'followingUsers.created_recipes',
//             foreignField: '_id',
//             as: 'recipe',
//         }
//     }, {
//         $unwind: '$recipe'
//     }, {
//         $project: {
//             _id: 0,
//             'recipe.title': 1,
//             'recipe.picture': 1,
//             'recipe.time': 1,
//             'recipe.rating': 1,
//             'recipe.difficulty': 1,
//             'recipe.createdAt': 1,
//             'recipe.page': { $lt: ['$recipe.createdAt', new Date(req.query.createdAt)] }
//         }
//     }, {
//         $match: {
//             'recipe.page': true
//         }
//     }, { 
//         $sort: { 
//             'recipe.createdAt': -1
//         } 
//     }
// ]).limit(20);