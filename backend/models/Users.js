const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UsersSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Please enter your name"],
        index: true,
        text: true
    },
    email: { 
        type: String, 
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'PLease enter a valid email']
    },
    password: { 
        type: String, 
        required: [true, "Please enter an password"],
        minlength: [6, "Your password should be at least 6 characters"]
    },
    date: { 
        type: String, 
        required: true 
    },
    picture: {
        type: String,
        default: "default.png"
    },
    followers: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User' 
    },
    following: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User' 
    },
    created_recipes: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Recipe' 
    },
    saved_recipes: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Recipe' 
    },
})

UsersSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next()
})

UsersSchema.statics.signin = async function(email, password) {
    const user = await this.findOne({ email });
    
    if (user) {
        const auth = bcrypt.compare(password, user.password);

        if (auth) {
            return user
        }
        throw Error("Incorrect password")
    }
    throw Error("Incorrect email")
}

module.exports = mongoose.model('User', UsersSchema);