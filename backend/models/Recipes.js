const mongoose = require('mongoose');

const IngredientsSchema = new mongoose.Schema({
    ingredient: { 
        type: String,
        required: true,
        index: true,
        text: true
    },
    measurement: { 
        type: String, 
        required: true,
        index: true,
        text: true
    },
    unit: {
        type: String,
        required: [true, "Please enter a unit"]
    }
}, { _id : false });

const ReviewsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        default: "No Comment"
    },
    date: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: [true, "Please enter a rating"],
        default: 1,
        min: [1, "Please enter a value between 1 and 5"],
        max: [5, "Please enter a value between 1 and 5"]
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, { _id : false });

const TimeSchema = new mongoose.Schema({
    hr: {
        type: Number,
        required: [true, "Please enter a valid number"],
        min: [0, "Please enter a value greater than 0"]
    },
    min: { 
        type: Number,
        required: [true, "Please enter a valid number"],
        min: [0, "Please enter a value between 0 and 60"],
        max: [60, "Please enter a value between 0 and 60"]
    }
}, { _id : false });

const RecipeSchema = new mongoose.Schema({
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    title: { 
        type: String, 
        required: [true, "Please enter a title"],
        index: true,
        text: true
    },
    date: { 
        type: String, 
        required: true 
    },
    picture: {
        type: String,
        default: "default.png",
        required: true
    },
    ingredients: { 
        type: [IngredientsSchema],
        required: [true, "Please enter the ingredients"]
    },
    reviews: { 
        type: [ReviewsSchema],
        required: true
    },
    steps: { 
        type: [String],
        required: [true, "Please enter the steps"]
    },
    time: { 
        type: TimeSchema,
        required: true
    },
    servings: { 
        type: Number,
        required: [true, "Please enter a valid number of servings"],
        min: [0, "Please enter a value greater than 0"]
    },
    description: { 
        type: String,
        required: [true, "Please enter a description"],
        index: true,
        text: true
    },
    difficulty: { 
        type: String,
        required: [true, "Please enter the difficulty"]
    },
    meal: {
        type: String,
        required: [true, "Please enter the meal"],
        index: true,
        text: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Recipe', RecipeSchema);