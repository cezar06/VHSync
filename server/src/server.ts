import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { VideoSyncHandler } from './websocket/VideoSyncHandler';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const videoSyncHandler = new VideoSyncHandler();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
    res.send('Video Sync Server is running');
});

// REST endpoint to create a new room
app.post('/api/rooms', (req, res) => {
    const roomId = uuidv4();
    res.json({ roomId });
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const roomId = url.searchParams.get('roomId');
    const userId = url.searchParams.get('userId') || uuidv4();

    if (!roomId) {
        ws.close();
        return;
    }

    videoSyncHandler.handleConnection(ws, roomId, userId);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});