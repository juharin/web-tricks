/**
 * Main Application Script
 * Coordinates all the interactive effects and provides utilities
 */
class App {
    constructor() {
        this.initialized = false;
        this.init();
    }
    
    init() {
        // Check if the DOM is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.onDOMReady();
        } else {
            // Wait for the DOM to be ready
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        }
        
        // Add resize handler for responsive adjustments
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 200));
    }
    
    onDOMReady() {
        if (this.initialized) return;
        this.initialized = true;
        
        // Log initialization
        console.log('Interactive Design Showcase initialized');
        
        // Initialize observers for animation on scroll
        this.initIntersectionObservers();
        
        // Add any additional setup that needs to happen after DOM is fully loaded
        this.setupAccessibility();
        
        // Init the index.js script, which will be the primary script for the website
        this.initIndexScript();
    }
    
    initIntersectionObservers() {
        // Create intersection observer for fade-in animations
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation is triggered
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
        });
        
        // Apply to feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeInObserver.observe(card);
        });
        
        // Apply to tilt cards
        document.querySelectorAll('.tilt-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            fadeInObserver.observe(card);
        });
        
        // Apply to gradient boxes
        document.querySelectorAll('.gradient-border-box').forEach((box, index) => {
            box.style.opacity = '0';
            box.style.transform = 'translateY(40px)';
            box.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            fadeInObserver.observe(box);
        });
        
        // Define CSS for visible class
        const style = document.createElement('style');
        style.textContent = `
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAccessibility() {
        // Add ARIA attributes to interactive elements
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-label', 'Toggle dark/light theme');
            themeToggleBtn.setAttribute('role', 'switch');
            themeToggleBtn.setAttribute('aria-checked', document.body.classList.contains('light-theme') ? 'true' : 'false');
            
            // Update ARIA attributes on theme change
            document.addEventListener('themeChange', (e) => {
                themeToggleBtn.setAttribute('aria-checked', e.detail.theme === 'light' ? 'true' : 'false');
            });
        }
        
        // Add keyboard navigation for card interactions
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            // Handle keyboard events
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Activate card's main action (usually the button inside)
                    const btn = card.querySelector('.card-btn');
                    if (btn) btn.click();
                }
            });
        });
    }
    
    handleResize() {
        // Recalculate any size-dependent features
        console.log('Window resized, adjusting layouts');
        
        // Dispatch custom event for components to listen to
        const resizeEvent = new CustomEvent('appResize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
        document.dispatchEvent(resizeEvent);
    }
    
    // Utility method to debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize the main index.js script loaded separately
    initIndexScript() {
        // This is where we could load the main index.js script if it exists
        // For now, we'll just check if the index.js script is already loaded
        if (window.indexScriptInitialized) {
            console.log('Index script already initialized');
        } else {
            // Custom initialization if needed
            console.log('No index script detected, running standalone mode');
        }
    }
}

// Initialize the application
const app = new App(); 