import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VideoSyncService } from '../../services/video-sync.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-video-player',
    standalone: true,
    template: `
        <div class="video-container">
            <video #videoPlayer class="video-player" controls preload="auto">
                <source src="assets/demo.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `,
    styles: [`
        .video-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .video-player {
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    `]
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    private subscription: Subscription = new Subscription();

    constructor(
        private videoSyncService: VideoSyncService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        const roomId = this.route.snapshot.params['roomId'];
        this.videoSyncService.connect(roomId);
    }

    ngAfterViewInit() {
        const video = this.videoPlayer.nativeElement;
        this.videoSyncService.setVideoElement(video);
    }

    ngOnDestroy() {
        this.videoSyncService.disconnect();
        this.subscription.unsubscribe();
    }
} 