import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

interface Room {
    id: string;
    users: Set<WebSocket>;
    videoUrl?: string;
    videoState: {
        isPlaying: boolean;
        currentTime: number;
    };
}

interface WSMessage {
    type: 'join_room' | 'video_control' | 'chat_message';
    roomId?: string;
    payload?: any;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory storage for rooms
const rooms = new Map<string, Room>();

app.use(cors());
app.use(express.json());

// HTTP endpoints
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        try {
            const data: WSMessage = JSON.parse(message.toString());
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function handleWebSocketMessage(ws: WebSocket, data: WSMessage): void {
    switch (data.type) {
        case 'join_room':
            // Handle room joining
            break;
        case 'video_control':
            // Handle video control (play/pause/seek)
            break;
        case 'chat_message':
            // Handle chat messages
            break;
        default:
            console.log('Unknown message type:', data.type);
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});