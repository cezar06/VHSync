import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = {
  name: string;
  class: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  gradients: {
    primary: string;
    secondary: string;
  };
};

export const THEMES: { [key: string]: Theme } = {
  modernY2k: {
    name: 'Modern Y2K',
    class: 'theme-modern-y2k',
    colors: {
      primary: '#FF66C4',
      secondary: '#66E0FF',
      accent: '#B967FF',
      background: '#000000',
      text: '#E8E8E8'
    },
    gradients: {
      primary: 'linear-gradient(45deg, #FF66C4, #66E0FF, #B967FF)',
      secondary: 'linear-gradient(180deg, #FFFFFF, #E8E8E8, #B4B4B4)'
    }
  },
  classicY2k: {
    name: 'Classic Y2K',
    class: 'theme-classic-y2k',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#000080',
      text: '#FFFFFF'
    },
    gradients: {
      primary: 'linear-gradient(45deg, #FF00FF, #00FFFF)',
      secondary: 'linear-gradient(180deg, #000080, #0000FF)'
    }
  },
  vaporwave: {
    name: 'Vaporwave',
    class: 'theme-vaporwave',
    colors: {
      primary: '#FF6AD5',
      secondary: '#26C9FF',
      accent: '#FFA8A8',
      background: '#2D0B3A',
      text: '#F8F8F8'
    },
    gradients: {
      primary: 'linear-gradient(45deg, #FF6AD5, #26C9FF, #FFA8A8)',
      secondary: 'linear-gradient(180deg, #2D0B3A, #8B31D9)'
    }
  },
  cyberY2k: {
    name: 'Cyber Y2K',
    class: 'theme-cyber-y2k',
    colors: {
      primary: '#0FF',
      secondary: '#F0F',
      accent: '#0F0',
      background: '#111',
      text: '#0FF'
    },
    gradients: {
      primary: 'linear-gradient(45deg, #0FF, #F0F)',
      secondary: 'linear-gradient(180deg, #111, #222)'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>(THEMES['modernY2k']);
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && THEMES[savedTheme]) {
      this.setTheme(THEMES[savedTheme]);
    }
  }

  setTheme(theme: Theme) {
    localStorage.setItem('selectedTheme', theme.name.toLowerCase().replace(' ', ''));
    this.currentThemeSubject.next(theme);
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--primary-gradient', theme.gradients.primary);
    root.style.setProperty('--secondary-gradient', theme.gradients.secondary);
  }

  getThemes(): Theme[] {
    return Object.values(THEMES);
  }
} 