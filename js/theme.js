/**
 * Theme Switcher
 * Toggles between light and dark themes with a smooth transition
 */
class ThemeSwitcher {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.body = document.body;
        this.currentTheme = 'dark'; // Default theme
        this.transitionDuration = 600; // ms
        
        // Check if user has a theme preference in localStorage
        this.storedTheme = localStorage.getItem('theme');
        
        this.init();
    }

    init() {
        // Apply stored theme or default
        if (this.storedTheme) {
            this.setTheme(this.storedTheme);
        } else {
            // Check user's system preferences
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.setTheme('light');
            }
        }
        
        // Add click event to theme toggle button
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Create and dispatch custom event
        const event = new CustomEvent('themeChange', { detail: { theme: newTheme } });
        document.dispatchEvent(event);
    }

    setTheme(theme) {
        // Create a temporary div for the transition effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = theme === 'dark' ? '#1a202c' : '#f8f9fa';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.transition = `opacity ${this.transitionDuration}ms ease`;
        
        document.body.appendChild(overlay);
        
        // Begin transition
        setTimeout(() => {
            overlay.style.opacity = '0.3';
        }, 10);
        
        // After the overlay begins to appear, switch the theme
        setTimeout(() => {
            // Remove previous theme class
            this.body.classList.remove(`${this.currentTheme}-theme`);
            
            // Add new theme class
            this.body.classList.add(`${theme}-theme`);
            
            // Update current theme
            this.currentTheme = theme;
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
            
            // Fade out the overlay
            overlay.style.opacity = '0';
        }, this.transitionDuration / 2);
        
        // Remove the overlay after the transition completes
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, this.transitionDuration);
    }
}

// Initialize theme switcher when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = new ThemeSwitcher();
}); 