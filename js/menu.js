/**
 * Menu System
 * Simple popup menu that opens on click
 */
class MenuSystem {
    constructor() {
        // Elements
        this.toggle = document.querySelector('.popup-toggle');
        this.menu = document.querySelector('.popup-menu');
        this.headerLeft = document.querySelector('.header-left');
        this.backdrop = document.querySelector('#popup-backdrop');
        this.links = document.querySelectorAll('.popup-menu-links a');
        this.header = document.querySelector('header');
        
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.toggle || !this.menu || !this.headerLeft) {
            console.warn('Menu elements not found:', { 
                toggle: !!this.toggle, 
                menu: !!this.menu, 
                headerLeft: !!this.headerLeft 
            });
            return;
        }
        
        console.log('Menu system initialized', {
            toggle: this.toggle,
            menu: this.menu,
            headerLeft: this.headerLeft
        });
        
        // Position the menu initially
        this.updateMenuPosition();
        
        // Update position on window resize
        window.addEventListener('resize', () => {
            this.updateMenuPosition();
        });
        
        // Toggle menu on click
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
            console.log('Toggle clicked, menu state:', this.isMenuOpen);
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.menu.contains(e.target) && 
                !this.toggle.contains(e.target)) {
                console.log('Clicked outside menu, closing');
                this.closeMenu();
            }
        });
        
        // Setup smooth scrolling for menu links
        this.setupSmoothScrolling();
        
        // Handle scroll for header styling
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    updateMenuPosition() {
        // Get toggle button position
        const toggleRect = this.toggle.getBoundingClientRect();
        const headerRect = this.header.getBoundingClientRect();
        
        // Position menu below toggle button
        this.menu.style.top = `${headerRect.height + 10}px`;
        this.menu.style.left = `${toggleRect.left}px`;
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        console.log('Opening menu');
        this.isMenuOpen = true;
        this.headerLeft.classList.add('menu-active'); // Keep for the ellipsis animation
        this.menu.classList.add('active'); // Add active class directly to menu
        
        // Update position before showing
        this.updateMenuPosition();
        
        if (this.backdrop) {
            this.backdrop.classList.add('active');
        }
        
        console.log('Menu opened');
    }
    
    closeMenu() {
        console.log('Closing menu');
        this.isMenuOpen = false;
        this.headerLeft.classList.remove('menu-active');
        this.menu.classList.remove('active');
        
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
        
        console.log('Menu closed');
    }
    
    setupSmoothScrolling() {
        if (!this.links) return;
        
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Close menu first
                        this.closeMenu();
                        
                        // Then scroll to element
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                }
            });
        });
    }
    
    handleScroll() {
        if (!this.header) return;
        
        // Add shadow when scrolled down
        if (window.scrollY > 10) {
            this.header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            //this.header.style.padding = '1rem 0';
            
            // Update menu position when header size changes
            this.updateMenuPosition();
        } else {
            this.header.style.boxShadow = '';
            //this.header.style.padding = '1.5rem 0';
            
            // Update menu position when header size changes
            this.updateMenuPosition();
        }
    }
}

// Create a backward compatibility class for AnimatedMenu
class AnimatedMenu {
    constructor() {
        console.log('AnimatedMenu is deprecated, using MenuSystem instead');
        this.menuSystem = new MenuSystem();
        return this.menuSystem;
    }
}

// Make AnimatedMenu available globally
window.AnimatedMenu = AnimatedMenu;

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing menu system');
    new MenuSystem();
}); 