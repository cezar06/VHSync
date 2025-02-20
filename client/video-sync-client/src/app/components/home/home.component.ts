import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="container">
            <h1>Video Sync</h1>
            <div class="actions">
                <button (click)="createRoom()" class="btn">Create New Room</button>
                <div class="join-room">
                    <input [(ngModel)]="roomId" 
                           placeholder="Enter Room ID"
                           class="room-input">
                    <button (click)="joinRoom()" 
                            [disabled]="!roomId"
                            class="btn">
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            margin-bottom: 30px;
            color: #333;
        }
        .actions {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .join-room {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .room-input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
        }
        .btn {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    `]
})
export class HomeComponent {
    roomId: string = '';

    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    createRoom() {
        this.http.post<{roomId: string}>(`${environment.apiUrl}/api/rooms`, {})
            .subscribe(response => {
                this.router.navigate(['/room', response.roomId]);
            });
    }

    joinRoom() {
        if (this.roomId) {
            this.router.navigate(['/room', this.roomId]);
        }
    }
} 