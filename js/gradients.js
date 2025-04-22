/**
 * Advanced Gradient Effects
 * Creates dynamic gradient borders and backgrounds with random movement
 */
class GradientEffects {
    constructor(options = {}) {
        // Default configuration
        this.options = {
            selector: '.gradient-border-box',
            glowSelector: '.gradient-border-box .box-content',
            colors: [
                'rgba(66, 99, 235, 1)', // blue
                'rgba(112, 72, 232, 1)',  // purple
                'rgba(230, 73, 128, 1)'   // pink
            ],
            // Additional color sets for more dramatic shifts
            colorSets: [
                [
                    'rgba(66, 99, 235, 1)',
                    'rgba(112, 72, 232, 1)',
                    'rgba(230, 73, 128, 1)'
                ],
                [
                    'rgba(245, 158, 11, 1)', 
                    'rgba(236, 72, 153, 1)', 
                    'rgba(139, 92, 246, 1)'
                ],
                [
                    'rgba(52, 211, 153, 1)', 
                    'rgba(59, 130, 246, 1)', 
                    'rgba(217, 70, 239, 1)'
                ]
            ],
            transitionSpeed: 0.5, // seconds
            pulseSpeed: 2, // seconds
            colorShiftSpeed: 6, // seconds (faster for more visible effect)
            borderWidth: '2px', // Narrower border
            pulseIntensity: 0.4, // Higher intensity for more visible pulse
            ...options
        };
        
        this.gradientElements = [];
        this.glowElements = [];
        this.animationFrameId = null;
        this.init();
    }
    
    init() {
        // Select all gradient elements
        const elements = document.querySelectorAll(this.options.selector);
        const glowElements = document.querySelectorAll(this.options.glowSelector);
        
        if (!elements.length) {
            console.warn(`No elements found with selector: ${this.options.selector}`);
            return;
        }
        
        // Initialize each element
        elements.forEach((element, index) => {
            this.setupGradientElement(element, index);
        });
        
        // Initialize glow elements
        glowElements.forEach((element, index) => {
            this.setupGlowElement(element, index);
        });
        
        // Start animation loop
        this.animate();
        
        // Listen for theme changes
        document.addEventListener('themeChange', this.handleThemeChange.bind(this));
    }
    
    handleThemeChange(event) {
        // Adjust gradient colors based on the theme
        const theme = event.detail.theme;
        
        // Update colors for gradients if needed
        // This is optional, as the current gradient looks good in both themes
    }
    
    setupGradientElement(element, index) {
        // Select a random color set for this element
        const colorSetIndex = Math.floor(Math.random() * this.options.colorSets.length);
        const colors = [...this.options.colorSets[colorSetIndex]];
        
        // Create unique animation properties for each element
        const animationData = {
            element: element,
            colors: colors,
            initialColors: [...colors], // Store initial colors for color shifting
            targetColors: this.getNextColorSet(colorSetIndex), // Target colors to transition to
            colorTransitionProgress: 0, // Progress of color transition (0-1)
            speed: this.options.colorShiftSpeed * (0.8 + Math.random() * 0.4), // Slight randomization
            angle: Math.random() * 360, // Random starting angle
            angleSpeed: 0.1 + Math.random() * 0.15, // Random speed of angle change (increased)
            colorPhase: Math.random() * 100, // Random color phase
            colorDirection: Math.random() > 0.5 ? 1 : -1, // Random direction
            colorShiftTime: 0, // Timer for color shifting
            colorShiftDuration: this.options.colorShiftSpeed * 1000 * (0.8 + Math.random() * 0.4), // Duration for color shift
            colorSetIndex: colorSetIndex, // Track which color set we're using
            update: timestamp => this.updateGradient(animationData, timestamp)
        };
        
        // Override default CSS animation
        element.style.animation = 'none';
        element.style.transition = `all ${this.options.transitionSpeed}s ease`;
        
        // Initialize gradient angle
        this.updateGradient(animationData, 0);
        
        // Store animation data
        this.gradientElements.push(animationData);
    }
    
    getNextColorSet(currentIndex) {
        // Get a different color set than the current one
        let nextIndex = currentIndex;
        while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * this.options.colorSets.length);
        }
        return [...this.options.colorSets[nextIndex]];
    }
    
    setupGlowElement(element, index) {
        // Create unique animation properties for each glow element
        const glowData = {
            element: element,
            opacity: 0,
            pulseDirection: 1,
            pulseSpeed: this.options.pulseSpeed * (0.8 + Math.random() * 0.4), // Slight randomization
            lastUpdate: 0,
            update: timestamp => this.updateGlow(glowData, timestamp)
        };
        
        // Store animation data
        this.glowElements.push(glowData);
    }
    
    updateGradient(data, timestamp) {
        // Update angle for "movement" effect
        data.angle += data.angleSpeed;
        
        // Handle color shifting over time
        if (timestamp) {
            // Calculate progress of color transition
            data.colorShiftTime += 16; // Approximately 16ms per frame
            data.colorTransitionProgress = Math.min(data.colorShiftTime / data.colorShiftDuration, 1);
            
            // If transition is complete, set up the next transition
            if (data.colorTransitionProgress >= 1) {
                data.initialColors = [...data.targetColors];
                data.targetColors = this.getNextColorSet(data.colorSetIndex);
                data.colorSetIndex = this.options.colorSets.findIndex(set => 
                    set[0] === data.targetColors[0]
                );
                data.colorShiftTime = 0;
                data.colorTransitionProgress = 0;
            }
            
            // Interpolate between initial and target colors
            for (let i = 0; i < data.colors.length; i++) {
                const initialRgba = this.parseRgba(data.initialColors[i]);
                const targetRgba = this.parseRgba(data.targetColors[i]);
                
                // Linear interpolation of RGBA values
                const r = Math.round(this.lerp(initialRgba[0], targetRgba[0], data.colorTransitionProgress));
                const g = Math.round(this.lerp(initialRgba[1], targetRgba[1], data.colorTransitionProgress));
                const b = Math.round(this.lerp(initialRgba[2], targetRgba[2], data.colorTransitionProgress));
                
                // Update the current color
                data.colors[i] = `rgba(${r}, ${g}, ${b}, 1)`;
            }
        }
        
        // Create dynamic gradient
        const angle = data.angle % 360;
        const gradient = `linear-gradient(${angle}deg, ${data.colors.join(', ')})`;
        
        // Apply gradient as background or border
        data.element.style.background = gradient;
        
        // Keep the border width consistent
        data.element.style.padding = this.options.borderWidth;
    }
    
    parseRgba(rgbaString) {
        // Extract values from rgba(r, g, b, a)
        const values = rgbaString.match(/\d+(\.\d+)?/g);
        return values ? values.map(v => parseFloat(v)) : [0, 0, 0, 0];
    }
    
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    
    updateGlow(data, timestamp) {
        if (!timestamp) return;
        
        // Update only if enough time has passed (optimization)
        if (timestamp - data.lastUpdate < 30) return;
        data.lastUpdate = timestamp;
        
        // Calculate pulse effect (more dramatic)
        const time = timestamp / (data.pulseSpeed * 1000);
        const pulseFactor = Math.sin(time) * 0.5 + 0.5; // Value between 0 and 1
        
        // Apply more visible pulsing glow
        const glowOpacity = 0.1 + pulseFactor * this.options.pulseIntensity; // Increased intensity
        const glowColor = this.options.colors[0].replace('1)', `${glowOpacity})`);
        const glowSize = 5 + pulseFactor * 25; // Varies between 5px and 30px (increased range)
        
        // Apply glow effect
        data.element.style.boxShadow = `0 0 ${glowSize}px ${glowColor}, inset 0 0 ${glowSize/2}px ${glowColor}`;
    }
    
    animate(timestamp) {
        // Update all gradient elements
        this.gradientElements.forEach(data => {
            data.update(timestamp);
        });
        
        // Update all glow elements
        this.glowElements.forEach(data => {
            data.update(timestamp);
        });
        
        // Continue animation loop
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize gradient effects when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gradientEffects = new GradientEffects();
}); 