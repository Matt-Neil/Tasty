const mongoose = require('mongoose');

const mongoDB = process.env.MONGO;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Connected MongoDB')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;