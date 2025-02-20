import { WebSocket } from 'ws';

interface VideoRoom {
    users: Map<string, WebSocket>;
    currentTime: number;
    isPlaying: boolean;
    lastUpdateTime: number;
}

export class VideoSyncHandler {
    private rooms: Map<string, VideoRoom> = new Map();

    handleConnection(ws: WebSocket, roomId: string, userId: string) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                users: new Map(),
                currentTime: 0,
                isPlaying: false,
                lastUpdateTime: Date.now()
            });
        }

        const room = this.rooms.get(roomId)!;
        room.users.set(userId, ws);

        ws.on('message', (message: string) => {
            try {
                const data = JSON.parse(message);
                this.handleVideoEvent(roomId, userId, data);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        ws.on('close', () => {
            room.users.delete(userId);
            if (room.users.size === 0) {
                this.rooms.delete(roomId);
            }
        });

        // Send initial state to the new user
        ws.send(JSON.stringify({
            type: 'sync',
            currentTime: this.getCurrentTime(room),
            isPlaying: room.isPlaying,
            timestamp: Date.now()
        }));
    }

    private getCurrentTime(room: VideoRoom): number {
        if (!room.isPlaying) {
            return room.currentTime;
        }
        const timePassed = (Date.now() - room.lastUpdateTime) / 1000;
        return room.currentTime + timePassed;
    }

    private handleVideoEvent(roomId: string, senderId: string, data: any) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const currentTime = data.currentTime;
        const timestamp = Date.now();

        switch (data.type) {
            case 'play':
                room.isPlaying = true;
                room.currentTime = currentTime;
                room.lastUpdateTime = timestamp;
                break;
            case 'pause':
                room.isPlaying = false;
                room.currentTime = currentTime;
                room.lastUpdateTime = timestamp;
                break;
            case 'seek':
                room.currentTime = currentTime;
                room.lastUpdateTime = timestamp;
                break;
            case 'sync':
                room.currentTime = currentTime;
                room.isPlaying = data.isPlaying;
                room.lastUpdateTime = timestamp;
                break;
            case 'request_sync':
                // Only respond with current state, don't update room state
                const currentState = {
                    type: 'sync',
                    currentTime: this.getCurrentTime(room),
                    isPlaying: room.isPlaying,
                    timestamp: timestamp
                };
                const requester = room.users.get(senderId);
                if (requester) {
                    requester.send(JSON.stringify(currentState));
                }
                return; // Don't broadcast request_sync events
        }

        // Add timestamp and broadcast to all users except sender
        const eventToSend = { ...data, timestamp };
        room.users.forEach((userWs, userId) => {
            if (userId !== senderId) {
                userWs.send(JSON.stringify(eventToSend));
            }
        });
    }
} 