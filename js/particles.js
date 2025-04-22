/**
 * Simple Particle System
 * Creates particles that are attracted to the mouse cursor
 */
class ParticleSystem {
    constructor() {
        // Configuration
        this.config = {
            particleCount: 40,
            particleSize: { min: 2, max: 6 },
            colors: ['#60a5fa', '#a78bfa', '#f472b6', '#f1f5f9'],
            baseSpeed: 0.5,
            attractionStrength: 0.3,
            attractionRange: 300
        };
        
        // Initialize properties
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mouseMoving = false;
        
        // Initialize
        if (this.container) {
            this.init();
        } else {
            console.error('Particle container not found!');
        }
    }
    
    init() {
        // Create particles
        this.createParticles();
        
        // Add event listeners
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Start animation loop
        this.animate();
    }
    
    createParticles() {
        // Clear existing particles
        this.container.innerHTML = '';
        this.particles = [];
        
        // Create new particles
        for (let i = 0; i < this.config.particleCount; i++) {
            const size = this.random(this.config.particleSize.min, this.config.particleSize.max);
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const colorIndex = Math.floor(Math.random() * this.config.colors.length);
            
            // Create DOM element
            const element = document.createElement('div');
            element.className = 'particle';
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.position = 'absolute';
            element.style.backgroundColor = this.config.colors[colorIndex];
            element.style.borderRadius = '50%';
            element.style.opacity = '0.7';
            element.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, 0.1)`;
            element.style.transform = `translate(${x}px, ${y}px)`;
            
            // Add to DOM
            this.container.appendChild(element);
            
            // Store particle data
            this.particles.push({
                element: element,
                x: x,
                y: y,
                size: size,
                vx: Math.random() - 0.5,
                vy: Math.random() - 0.5,
                speed: this.config.baseSpeed * (1 - size / this.config.particleSize.max * 0.5) // Smaller particles move faster
            });
        }
    }
    
    random(min, max) {
        return min + Math.random() * (max - min);
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouseMoving = true;
        
        // Reset mouse moving flag after a short delay
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
            this.mouseMoving = false;
        }, 100);
    }
    
    handleResize() {
        // Recreate particles on window resize
        this.createParticles();
    }
    
    animate() {
        this.updateParticles();
        requestAnimationFrame(this.animate.bind(this));
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Calculate vector to mouse
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply attraction force
            if (distance < this.config.attractionRange) {
                // Calculate attraction strength (stronger when closer)
                const force = this.config.attractionStrength * (1 - distance / this.config.attractionRange);
                
                // Normalize direction vector
                const dirX = dx / (distance || 1);
                const dirY = dy / (distance || 1);
                
                // Apply attraction force
                particle.vx += dirX * force;
                particle.vy += dirY * force;
            }
            
            // Apply friction to gradually slow down particles
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // Update position based on velocity
            particle.x += particle.vx * particle.speed;
            particle.y += particle.vy * particle.speed;
            
            // Wrap particles around the screen
            if (particle.x < -50) particle.x = window.innerWidth + 50;
            if (particle.x > window.innerWidth + 50) particle.x = -50;
            if (particle.y < -50) particle.y = window.innerHeight + 50;
            if (particle.y > window.innerHeight + 50) particle.y = -50;
            
            // Update element position
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 