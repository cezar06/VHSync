import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FormsModule, ThemeSelectorComponent],
    template: `
        <div class="min-h-screen bg-[var(--background-color)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <!-- Y2K-inspired background elements -->
            <div class="absolute inset-0 opacity-20 animate-gradient" style="background: var(--primary-gradient)"></div>
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-10"></div>

            <div class="max-w-lg mx-auto">
                <div class="text-center mb-16">
                    <h1 class="text-8xl font-digital text-[var(--primary-color)] mb-6 animate-glitch tracking-wider">
                        Video Sync
                    </h1>
                    <p class="text-[var(--text-color)] font-y2k text-2xl tracking-wide">
                        Watch together, anywhere
                    </p>
                </div>

                <div class="bg-black/40 backdrop-blur-xl rounded-xl border-3 border-[var(--accent-color)] p-10 shadow-chrome">
                    <div class="space-y-8">
                        <!-- Create Room Button -->
                        <button 
                            (click)="createRoom()"
                            class="w-full bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white font-digital text-2xl py-5 rounded-lg border-2 border-white shadow-y2k transition-all hover:translate-x-0.5 hover:-translate-y-0.5 flex items-center justify-center gap-3">
                            <span class="text-[var(--accent-color)] text-3xl">+</span>
                            Create New Room
                        </button>
                        
                        <!-- Divider -->
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border border-[var(--text-color)] opacity-20"></div>
                            </div>
                            <div class="relative flex justify-center">
                                <span class="px-6 text-[var(--text-color)] bg-[var(--background-color)] text-xl font-digital tracking-wider">or join existing</span>
                            </div>
                        </div>

                        <!-- Join Room Form -->
                        <div class="flex gap-4">
                            <input 
                                [(ngModel)]="roomId"
                                placeholder="Enter Room ID"
                                class="flex-1 bg-black/50 border-2 border-[var(--secondary-color)] text-[var(--text-color)] font-digital text-xl px-6 py-4 rounded-lg focus:outline-none focus:border-[var(--accent-color)] focus:shadow-neon placeholder-[var(--text-color)]/50"
                                [class.border-[var(--primary-color)]]="!roomId && showError"
                            >
                            <button 
                                (click)="joinRoom()"
                                [disabled]="!roomId"
                                class="bg-[var(--secondary-color)] hover:bg-[var(--accent-color)] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white font-digital text-2xl px-8 py-4 rounded-lg border-2 border-white shadow-y2k transition-all hover:translate-x-0.5 hover:-translate-y-0.5 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <app-theme-selector />
        </div>
    `
})
export class HomeComponent {
    roomId: string = '';
    showError: boolean = false;

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
        } else {
            this.showError = true;
        }
    }
} 