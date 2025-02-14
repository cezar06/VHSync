import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('videoAction', (data) => {
        console.log('Received videoAction:', data);
        socket.broadcast.emit('videoAction', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});