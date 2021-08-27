const mongoose = require('mongoose');

const IngredientsSchema = new mongoose.Schema({
    ingredient: { 
        type: String,
        required: [true, "Please enter an ingredient"]
    },
    measurement: { 
        type: [Number, "Please enter a number"], 
        required: [true, "Please enter a measurement"],
        min: [0, "Please enter a value greater than 0"]
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
        type: [Number, "Please enter a number"], 
        required: [true, "Please enter a rating"]
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, { _id : false });

const TimeSchema = new mongoose.Schema({
    hr: {
        type: [Number, "Please enter a number"],
        required: [true, "Please enter the hours"],
        min: [0, "Please enter a value greater than 0"]
    },
    min: { 
        type: [Number, "Please enter a number"], 
        required: [true, "Please enter a minutes"],
        min: [0, "Please enter a value between 0 and 60"],
        max: [60, "Please enter a value between 0 and 60"],
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
        index: true
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
        required: [true, "Please enter a time"]
    },
    servings: { 
        type: [Number, "Please enter a number"],
        required: [true, "Please enter the number of servings"],
        min: [0, "Please enter a value greater than 0"]
    },
    description: { 
        type: String,
        required: [true, "Please enter a description"],
        index: true
    },
    difficulty: { 
        type: String,
        required: [true, "Please enter the difficulty"]
    },
    meal: {
        type: String,
        required: [true, "Please enter the meal"]
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Recipe', RecipeSchema);