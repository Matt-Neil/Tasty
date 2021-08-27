const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "tasty secret", async (err, decodedToken) => {
            if (err) {
                res.locals.currentUser = null;
                next();
            } else {
                const user = await Users.findById(decodedToken.id)
                                .populate('followers', 'name')
                                .populate('following', 'name')
                                .populate('saved_recipes', 'title picture time rating difficulty')
                                .populate('created_recipes', 'title picture time rating difficulty');

                res.locals.currentUser = user;
                next();
            }
        });
    } else {
        res.locals.currentUser = null;
        next();
    }
}

module.exports = { checkUser }