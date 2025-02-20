import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <button 
        (click)="isOpen = !isOpen" 
        class="bg-black/80 backdrop-blur-xl text-white font-digital px-4 py-2 rounded-full border-2 border-white shadow-y2k transition-all hover:translate-x-0.5 hover:-translate-y-0.5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"/>
        </svg>
        Theme
      </button>

      <div 
        *ngIf="isOpen" 
        class="absolute bottom-full right-0 mb-2 w-64 bg-black/90 backdrop-blur-xl rounded-lg border-2 border-white shadow-chrome overflow-hidden">
        <div class="p-4 space-y-2">
          <div 
            *ngFor="let theme of themes"
            (click)="selectTheme(theme)"
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10"
            [ngClass]="{ 'bg-white/20': (currentTheme$ | async)?.name === theme.name }">
            <div class="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <div class="w-full h-full" [style.background]="theme.gradients.primary"></div>
            </div>
            <span class="font-digital text-lg text-white">{{ theme.name }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ThemeSelectorComponent implements OnInit {
  themes: Theme[] = [];
  isOpen = false;
  currentTheme$;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngOnInit() {
    this.themes = this.themeService.getThemes();
  }

  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.isOpen = false;
  }
} 