import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface VideoEvent {
    type: 'play' | 'pause' | 'seek' | 'sync' | 'request_sync';
    currentTime?: number;
    isPlaying?: boolean;
    timestamp?: number;
}

@Injectable({
    providedIn: 'root'
})
export class VideoSyncService {
    private ws: WebSocket | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private readonly syncInterval = 3000; // Sync every 3 seconds
    private readonly maxDriftThreshold = 1; // Maximum allowed drift in seconds
    private ignoreNextEvent = false;

    videoEvents = new Subject<VideoEvent>();

    constructor() {}

    connect(roomId: string): void {
        const userId = Math.random().toString(36).substring(7);
        this.ws = new WebSocket(`${environment.wsUrl}?roomId=${roomId}&userId=${userId}`);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
            // Request initial sync state
            this.sendEvent({ type: 'request_sync' });
            
            // Start periodic sync checks
            interval(this.syncInterval).subscribe(() => {
                if (this.videoElement && this.ws?.readyState === WebSocket.OPEN) {
                    this.sendEvent({ type: 'request_sync' });
                }
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data: VideoEvent = JSON.parse(event.data);
                this.handleVideoEvent(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    setVideoElement(video: HTMLVideoElement): void {
        this.videoElement = video;
        
        this.videoElement.onplay = () => {
            if (!this.ignoreNextEvent) {
                this.sendEvent({
                    type: 'play',
                    currentTime: this.videoElement?.currentTime
                });
            }
            this.ignoreNextEvent = false;
        };

        this.videoElement.onpause = () => {
            if (!this.ignoreNextEvent) {
                this.sendEvent({
                    type: 'pause',
                    currentTime: this.videoElement?.currentTime
                });
            }
            this.ignoreNextEvent = false;
        };

        this.videoElement.onseeked = () => {
            if (!this.ignoreNextEvent) {
                this.sendEvent({
                    type: 'seek',
                    currentTime: this.videoElement?.currentTime
                });
            }
            this.ignoreNextEvent = false;
        };
    }

    private handleVideoEvent(event: VideoEvent): void {
        if (!this.videoElement) return;

        const currentServerTime = event.currentTime || 0;
        const timestamp = event.timestamp || Date.now();
        const latency = (Date.now() - timestamp) / 1000; // Convert to seconds
        const adjustedTime = currentServerTime + (event.type === 'sync' && event.isPlaying ? latency : 0);

        switch (event.type) {
            case 'play':
                this.ignoreNextEvent = true;
                this.videoElement.currentTime = adjustedTime;
                this.videoElement.play();
                break;
            case 'pause':
                this.ignoreNextEvent = true;
                this.videoElement.currentTime = adjustedTime;
                this.videoElement.pause();
                break;
            case 'seek':
                this.ignoreNextEvent = true;
                this.videoElement.currentTime = adjustedTime;
                break;
            case 'sync':
                const drift = Math.abs(this.videoElement.currentTime - adjustedTime);
                if (drift > this.maxDriftThreshold) {
                    this.ignoreNextEvent = true;
                    this.videoElement.currentTime = adjustedTime;
                }
                if (event.isPlaying && this.videoElement.paused) {
                    this.ignoreNextEvent = true;
                    this.videoElement.play();
                } else if (!event.isPlaying && !this.videoElement.paused) {
                    this.ignoreNextEvent = true;
                    this.videoElement.pause();
                }
                break;
        }

        this.videoEvents.next(event);
    }

    private sendEvent(event: VideoEvent): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(event));
        }
    }

    disconnect(): void {
        this.ws?.close();
        this.ws = null;
    }
}