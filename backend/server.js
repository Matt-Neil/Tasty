require("dotenv").config();
const express = require("express");
const users = require('./routes/users');
const recipes = require('./routes/recipes');
const search = require('./routes/search');
const image = require('./routes/image');
const auth = require('./routes/auth');
const chats = require('./routes/chats')
const { checkUser } = require('./middleware/auth');
const port = process.env.PORT || 5000;
const connectDB = require('./db');
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDB();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

io.on('connect', socket => {
    socket.emit('receiveMessage', "hshdioahshdo")
    socket.join(socket.handshake.query.id)
    socket.on('sendMessage', message => {
        io.to(socket.handshake.query.id).emit('receiveMessage', message)
    })
})

app.get('*', checkUser);
app.post('*', checkUser);
app.put('*', checkUser);
app.delete('*', checkUser);
app.use('/api/user', users);
app.use('/api/recipes', recipes);
app.use('/api/search', search);
app.use('/api/image', image);
app.use('/api/auth', auth);
app.use('/api/chats', chats);

server.listen(port, console.log(`Server running on port ${port}.`));