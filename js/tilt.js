// Simplified Tilt Effect
class TiltEffect {
    constructor(options = {}) {
        console.clear();
        console.log('TiltEffect: Initializing...');

        // Default configuration merged with provided options
        this.options = {
            maxTilt: 35,
            scale: 1.05,
            speed: 300,
            glareOpacity: 0.45,
            perspective: 400,
            selector: '.tilt-card',
            ...options // Override defaults with provided options
        };

        this.cards = document.querySelectorAll(this.options.selector);

        if (this.cards.length === 0) {
            console.warn('TiltEffect: No elements found with selector:', this.options.selector);
            return;
        }

        console.log(`TiltEffect: Found ${this.cards.length} elements.`);
        this._injectStyles();
        this._initCards();
        
        // Expose reinitialize function for debugging or dynamic content
        window.reinitTilt = this.reinitialize.bind(this);
    }

    _injectStyles() {
        // Force remove any conflicting styles or ensure necessary styles exist
        let style = document.getElementById('tilt-effect-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tilt-effect-styles';
            style.textContent = `
                ${this.options.selector} {
                    transform-style: preserve-3d !important;
                    transition: none !important; /* Initial state should have no transition */
                    will-change: transform, box-shadow; /* Added box-shadow */
                    position: relative; /* Ensure position is relative */
                }
                ${this.options.selector} * {
                    pointer-events: none; /* Prevent interference from children */
                }
                /* Allow interactions within specific child elements if needed */
                /* Example: ${this.options.selector} .interactive-child { pointer-events: auto; } */
                 ${this.options.selector} .card-content { /* Keep original rule */
                     pointer-events: auto;
                 }
                .tilt-glare {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    pointer-events: none;
                    z-index: 2;
                    opacity: 0;
                    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 70%);
                    transition: opacity 0.2s ease;
                    will-change: background, opacity; /* Optimize glare changes */
                }
            `;
            document.head.appendChild(style);
        }
    }

    _initCards() {
        this.cards.forEach((card, index) => {
            console.log(`TiltEffect: Setting up card ${index + 1}...`);

            // Remove any existing glare elements
            const existingGlare = card.querySelector('.tilt-glare');
            if (existingGlare) existingGlare.remove();
            
            // Create glare element
            const glare = document.createElement('div');
            glare.className = 'tilt-glare';
            glare.style.position = 'absolute';
            glare.style.top = '0';
            glare.style.left = '0';
            glare.style.width = '100%';
            glare.style.height = '100%';
            glare.style.borderRadius = 'inherit';
            glare.style.pointerEvents = 'none';
            glare.style.zIndex = '2';
            glare.style.opacity = '0';
            glare.style.transition = 'opacity 0.2s ease';
            
            // Add glare to card
            card.appendChild(glare);
            card.glareElement = glare; // Store reference
            
            // Force card to have necessary 3D properties
            card.style.position = 'relative';
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform, box-shadow';
            
            // Initialize with perspective
            card.style.transform = `perspective(${this.options.perspective}px)`;
            
            // Bind event handlers - use instance methods
            card.onmouseenter = this._handleMouseEnter.bind(this, card, index);
            card.onmousemove = this._handleMouseMove.bind(this, card, index);
            card.onmouseleave = this._handleMouseLeave.bind(this, card, index);
            
            // Touch events - Reuse mouse handlers for simplicity
            card.ontouchstart = (e) => {
                if (e.touches.length === 1) {
                    // e.preventDefault(); // Consider if preventDefault is needed based on use case
                    const touch = e.touches[0];
                    this._handleMouseEnter(card, index, { clientX: touch.clientX, clientY: touch.clientY });
                }
            };
            card.ontouchmove = (e) => {
                if (e.touches.length === 1) {
                     // e.preventDefault(); // Consider if preventDefault is needed
                    const touch = e.touches[0];
                    this._handleMouseMove(card, index, { clientX: touch.clientX, clientY: touch.clientY });
                }
            };
            card.ontouchend = (e) => {
                // We might need to check if touches remain, but for simple tap/drag end, mouseleave works
                this._handleMouseLeave(card, index, e);
            };
             // Store bound listeners for potential removal later
             card._boundTiltListeners = {
                 mouseenter: card.onmouseenter,
                 mousemove: card.onmousemove,
                 mouseleave: card.onmouseleave,
                 touchstart: card.ontouchstart,
                 touchmove: card.ontouchmove,
                 touchend: card.ontouchend
             };

            console.log(`TiltEffect: Card ${index + 1} setup complete!`);
        });
    }

    _handleMouseEnter(card, index, e) {
        console.log(`TiltEffect: Mouse entered card ${index + 1}`);
        const glare = card.glareElement;

        // Remove transition for immediate response on move
        card.style.transition = 'none';
        
        // Force a reflow if needed (often helps ensure transition:none takes effect immediately)
        // void card.offsetWidth; 

        const isDarkTheme = document.body.classList.contains('dark-theme');
        const glareColor = isDarkTheme
            ? 'rgba(255, 255, 255, 0.3)' // Enhanced glare for dark theme
            : 'rgba(112, 72, 232, 0.2)'; // Adjusted glare for light theme

        // Reset glare position and show it
        glare.style.background = `radial-gradient(circle at 50% 50%, ${glareColor}, transparent 70%)`;
        glare.style.opacity = this.options.glareOpacity.toString();

        // Apply initial scale and perspective (mouse might enter without moving initially)
         card.style.transform = `perspective(${this.options.perspective}px) scale(${this.options.scale})`;

        // Bring card forward (consider using a class for this)
        card.style.zIndex = '10'; 
    }

    _handleMouseMove(card, index, e) {
        // Ensure no transition is active during mouse movement for instant updates
        card.style.transition = 'none';

        const glare = card.glareElement;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the card center (from -0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate tilt angles (adjust signs as needed for desired effect)
        const tiltY = x * this.options.maxTilt * -1; // Reversed for natural feel
        const tiltX = y * this.options.maxTilt * -1; // Adjust based on visual preference

        // Calculate glare position (from 0% to 100%)
        const glareX = (x + 0.5) * 100;
        const glareY = (y + 0.5) * 100;

        const isDarkTheme = document.body.classList.contains('dark-theme');
        const glareColor = isDarkTheme
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(112, 72, 232, 0.2)';
        
        // Update glare position and make edge sharper
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 60%)`;

        // Add subtle Z translation for depth
        const zTranslation = Math.max(Math.abs(x), Math.abs(y)) * 30; // Increased effect

        // Apply the transform
        card.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            translateZ(${zTranslation}px)
            scale(${this.options.scale})
        `;

        // Dynamic shadow based on tilt
        const shadowBlur = 15 + Math.abs(tiltX) + Math.abs(tiltY);
        const shadowOpacity = isDarkTheme ? 0.35 : 0.25;
        const shadowColor = isDarkTheme
            ? `rgba(255, 255, 255, ${shadowOpacity})`
            : `rgba(0, 0, 0, ${shadowOpacity})`;
        const xShadow = tiltY / 1.5; // Offset shadow based on tilt
        const yShadow = tiltX / 1.5; // Offset shadow based on tilt

        card.style.boxShadow = `${xShadow}px ${yShadow}px ${shadowBlur}px ${shadowColor}`;
    }

    _handleMouseLeave(card, index, e) {
        console.log(`TiltEffect: Mouse left card ${index + 1}`);
        const glare = card.glareElement;

        // Hide glare
        glare.style.opacity = '0';

        // Add transition for smooth reset
        const resetSpeed = this.options.speed + 100; // Slightly slower reset
        card.style.transition = `transform ${resetSpeed}ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow ${this.options.speed}ms ease-out`;

        // Reset transform
        card.style.transform = `perspective(${this.options.perspective}px) scale(1)`;

        // Reset shadow to default (consider using CSS variables or initial state)
        const isDarkTheme = document.body.classList.contains('dark-theme');
         // Use CSS variables if defined, otherwise fallback or leave blank
        card.style.boxShadow = isDarkTheme 
            ? (getComputedStyle(card).getPropertyValue('--dark-card-shadow') || '0 4px 12px rgba(200, 200, 200, 0.1)') 
            : (getComputedStyle(card).getPropertyValue('--card-shadow') || '0 4px 12px rgba(0, 0, 0, 0.1)');


        // Reset z-index after transition
        // Use setTimeout to ensure z-index changes after the visual transition completes
        card.resetZIndexTimeout = setTimeout(() => {
            card.style.zIndex = ''; // Reset to default or initial value
        }, resetSpeed); 
    }
    
    // Method to re-initialize or update cards (e.g., after adding new elements)
    reinitialize(newOptions = {}) {
        console.log("TiltEffect: Reinitializing...");
        // Clean up existing listeners and elements if necessary
        this.destroy(); 

        // Update options
        this.options = { ...this.options, ...newOptions };
        
        // Re-query elements and re-initialize
        this.cards = document.querySelectorAll(this.options.selector);
        if (this.cards.length === 0) {
            console.warn('TiltEffect Reinit: No elements found with selector:', this.options.selector);
            return;
        }
        console.log(`TiltEffect Reinit: Found ${this.cards.length} elements.`);
        this._injectStyles(); // Ensure styles are present
        this._initCards();
        console.log("TiltEffect: Reinitialization complete.");
    }

     // Method to clean up event listeners and potentially added elements/styles
     destroy() {
         console.log("TiltEffect: Destroying instances...");
         this.cards.forEach((card, index) => {
             // Clear any pending timeouts
             if (card.resetZIndexTimeout) clearTimeout(card.resetZIndexTimeout);

             // Remove event listeners safely
             if (card._boundTiltListeners) {
                 card.removeEventListener('mouseenter', card._boundTiltListeners.mouseenter);
                 card.removeEventListener('mousemove', card._boundTiltListeners.mousemove);
                 card.removeEventListener('mouseleave', card._boundTiltListeners.mouseleave);
                 card.removeEventListener('touchstart', card._boundTiltListeners.touchstart);
                 card.removeEventListener('touchmove', card._boundTiltListeners.touchmove);
                 card.removeEventListener('touchend', card._boundTiltListeners.touchend);
                 delete card._boundTiltListeners; // Clean up reference
             }
             // Reset styles applied directly? Optional, depends on desired cleanup level
             // card.style.transform = '';
             // card.style.boxShadow = '';
             // card.style.zIndex = '';
             // card.style.transition = ''; // Remove transition override

             // Remove glare element
             const glare = card.querySelector('.tilt-glare');
             if (glare) glare.remove();
             delete card.glareElement; // Clean up reference
             
             console.log(`TiltEffect: Cleaned up card ${index + 1}`);
         });

         // Optionally remove injected styles
         // const styleSheet = document.getElementById('tilt-effect-styles');
         // if (styleSheet) styleSheet.remove();

         // Clear the internal card list
         this.cards = []; 
         
         // Remove global debug function if it points to this instance
         if (window.reinitTilt === this.reinitialize.bind(this)) {
            // This comparison might be tricky. Better to check if the function itself matches.
            // Or, simply set window.reinitTilt = null; if only one instance is expected.
            // window.reinitTilt = null; 
         }
         
         console.log("TiltEffect: Destruction complete.");
     }
}

// Make the class globally available IF this script is loaded directly.
// If using modules, you would export the class instead.
window.TiltEffect = TiltEffect;
