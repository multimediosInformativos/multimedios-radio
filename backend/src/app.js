const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const announcementRoutes = require('./routes/announcement');
const authRoutes = require('./routes/auth');
const bannerRoutes = require('./routes/banner');
const playlistRoutes = require('./routes/playlist');
const summaryRoutes = require('./routes/summary');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/chat', chatRoutes);
app.use('/announcement', announcementRoutes);
app.use('/auth', authRoutes);
app.use('/banner', bannerRoutes);
app.use('/playlist', playlistRoutes);
app.use('/summary', summaryRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5004;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000", // Asegúrate de que esto coincida con tu frontend
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
