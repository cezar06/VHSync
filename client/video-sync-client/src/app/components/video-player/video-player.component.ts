import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VideoSyncService } from '../../services/video-sync.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [ThemeSelectorComponent],
    template: `
        <div class="min-h-screen bg-[var(--background-color)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <!-- Y2K-inspired background elements -->
            <div class="absolute inset-0 opacity-10 animate-gradient" style="background: var(--primary-gradient)"></div>
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] opacity-5"></div>

            <div class="max-w-5xl mx-auto">
                <!-- Header -->
                <div class="flex justify-between items-center mb-10">
                    <div class="flex items-center gap-4">
                        <h1 class="text-4xl font-digital text-[var(--text-color)] tracking-wider">
                            Room: <span class="text-[var(--primary-color)] animate-glitch">{{ roomId }}</span>
                        </h1>
                    </div>
                    <div class="flex gap-4">
                        <button 
                            (click)="copyRoomLink()" 
                            class="bg-[var(--accent-color)] hover:bg-[var(--primary-color)] text-white font-digital text-xl px-6 py-3 rounded-lg border-2 border-white shadow-y2k transition-all hover:translate-x-0.5 hover:-translate-y-0.5 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            Share Room
                        </button>
                        <button 
                            (click)="leaveRoom()" 
                            class="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-digital text-xl px-6 py-3 rounded-lg border-2 border-white shadow-y2k transition-all hover:translate-x-0.5 hover:-translate-y-0.5 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                            </svg>
                            Exit
                        </button>
                    </div>
                </div>
                
                <!-- Video Player -->
                <div class="bg-black/60 backdrop-blur-xl rounded-xl border-3 border-[var(--accent-color)] p-6 shadow-chrome overflow-hidden">
                    <video #videoPlayer 
                           class="w-full aspect-video rounded-lg" 
                           controls 
                           preload="auto">
                        <source src="assets/demo.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <app-theme-selector />
        </div>
    `
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    private subscription: Subscription = new Subscription();
    roomId: string = '';

    constructor(
        private videoSyncService: VideoSyncService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.roomId = this.route.snapshot.params['roomId'];
        this.videoSyncService.connect(this.roomId);
    }

    ngAfterViewInit() {
        const video = this.videoPlayer.nativeElement;
        this.videoSyncService.setVideoElement(video);
    }

    copyRoomLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            this.toastr.success('Room link copied to clipboard!', 'Success');
        }).catch(() => {
            this.toastr.error('Failed to copy room link', 'Error');
        });
    }

    leaveRoom() {
        this.router.navigate(['/']);
    }

    ngOnDestroy() {
        this.videoSyncService.disconnect();
        this.subscription.unsubscribe();
    }
} 