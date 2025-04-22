/**
 * Interactive Design Showcase API
 * 
 * This script provides a clean API to access and control all the
 * interactive effects implemented in the showcase.
 */

// Flag to indicate this script has been initialized
window.indexScriptInitialized = true;

// Define the main namespace
const DesignShowcase = {
    // Store component instances
    components: {},
    
    // Initialize all components with custom options
    init(options = {}) {
        console.log('Initializing DesignShowcase API');
        
        // Wait for DOM to be loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this._initComponents(options);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this._initComponents(options);
            });
        }
        
        return this;
    },
    
    // Internal method to initialize each component
    _initComponents(options) {
        // Initialize particles system
        if (options.particles !== false) {
            const particleOptions = options.particles || {};
            this.components.particles = new ParticleSystem(particleOptions);
        }
        
        // Initialize theme switcher
        if (options.themeSwitcher !== false) {
            this.components.themeSwitcher = new ThemeSwitcher();
        }
        
        // Initialize tilt effects
        if (options.tiltEffect !== false) {
            const tiltOptions = options.tiltEffect || {};
            this.components.tiltEffect = new TiltEffect(tiltOptions);
        }
        
        // Initialize gradient effects
        if (options.gradientEffects !== false) {
            const gradientOptions = options.gradientEffects || {};
            this.components.gradientEffects = new GradientEffects(gradientOptions);
        }
        
        // Initialize animated menu
        if (options.animatedMenu !== false) {
            this.components.animatedMenu = new AnimatedMenu();
        }
        
        // Dispatch initialization event
        document.dispatchEvent(new CustomEvent('designShowcaseInitialized'));
    },
    
    // API to control particles
    particles: {
        // Update particle settings
        updateSettings(options) {
            if (DesignShowcase.components.particles) {
                Object.assign(DesignShowcase.components.particles.options, options);
                return true;
            }
            return false;
        },
        
        // Add more particles
        add(count = 5) {
            if (DesignShowcase.components.particles) {
                for (let i = 0; i < count; i++) {
                    DesignShowcase.components.particles.createParticle();
                }
                return true;
            }
            return false;
        },
        
        // Get particle count
        getCount() {
            if (DesignShowcase.components.particles) {
                return DesignShowcase.components.particles.particles.length;
            }
            return 0;
        }
    },
    
    // API to control theme
    theme: {
        // Get current theme
        getCurrent() {
            if (DesignShowcase.components.themeSwitcher) {
                return DesignShowcase.components.themeSwitcher.currentTheme;
            }
            return document.body.classList.contains('light-theme') ? 'light' : 'dark';
        },
        
        // Set theme
        set(theme) {
            if (DesignShowcase.components.themeSwitcher && (theme === 'light' || theme === 'dark')) {
                DesignShowcase.components.themeSwitcher.setTheme(theme);
                return true;
            }
            return false;
        },
        
        // Toggle theme
        toggle() {
            if (DesignShowcase.components.themeSwitcher) {
                DesignShowcase.components.themeSwitcher.toggleTheme();
                return true;
            }
            return false;
        }
    },
    
    // API to control tilt effects
    tilt: {
        // Get all tilt cards
        getCards() {
            if (DesignShowcase.components.tiltEffect) {
                return DesignShowcase.components.tiltEffect.cards;
            }
            return [];
        },
        
        // Update tilt settings
        updateSettings(options) {
            if (DesignShowcase.components.tiltEffect) {
                Object.assign(DesignShowcase.components.tiltEffect.options, options);
                return true;
            }
            return false;
        }
    },
    
    // API to control gradient effects
    gradients: {
        // Update gradient settings
        updateSettings(options) {
            if (DesignShowcase.components.gradientEffects) {
                Object.assign(DesignShowcase.components.gradientEffects.options, options);
                return true;
            }
            return false;
        },
        
        // Get all gradient elements
        getElements() {
            if (DesignShowcase.components.gradientEffects) {
                return {
                    gradients: DesignShowcase.components.gradientEffects.gradientElements,
                    glowElements: DesignShowcase.components.gradientEffects.glowElements
                };
            }
            return { gradients: [], glowElements: [] };
        }
    },
    
    // API to control the navigation menu
    menu: {
        // Open the menu
        open() {
            if (DesignShowcase.components.animatedMenu && !DesignShowcase.components.animatedMenu.isMenuOpen) {
                DesignShowcase.components.animatedMenu.openMenu();
                return true;
            }
            return false;
        },
        
        // Close the menu
        close() {
            if (DesignShowcase.components.animatedMenu && DesignShowcase.components.animatedMenu.isMenuOpen) {
                DesignShowcase.components.animatedMenu.closeMenu();
                return true;
            }
            return false;
        },
        
        // Check if menu is open
        isOpen() {
            return DesignShowcase.components.animatedMenu ? 
                DesignShowcase.components.animatedMenu.isMenuOpen : false;
        }
    }
};

// Make the API globally available
window.DesignShowcase = DesignShowcase;

// Auto-initialize with default settings
document.addEventListener('DOMContentLoaded', () => {
    // Allow for manual initialization via window.DesignShowcase.init()
    // but auto-initialize after a short delay if not manually initialized
    setTimeout(() => {
        if (!DesignShowcase.components.particles) {
            DesignShowcase.init();
        }
    }, 100);
});
