# Interactive Design Showcase

A modern web page showcasing various interactive design effects and animations, inspired by [rspack.dev](https://rspack.dev). This project demonstrates advanced HTML, CSS, and JavaScript techniques to create visually appealing and interactive UI elements.

## Features

- **Particle Background**: Interactive particles that follow mouse movement
- **Theme Switching**: Toggle between light and dark themes with smooth transitions
- **Animated Menu**: Responsive navigation with smooth animations
- **3D Card Tilting**: Interactive cards with realistic 3D tilt and lighting effects
- **Gradient Borders**: Animated, moving gradient borders with glow effects
- **Responsive Design**: Adapts seamlessly to all screen sizes

## Live Demo

Open `index.html` in your browser to see all the effects in action.

## File Structure

```
├── index.html              # Main HTML file
├── index.js                # Main API for all effects
├── css/
│   └── style.css           # All styles
├── js/
│   ├── particles.js        # Mouse-following particles
│   ├── theme.js            # Theme switching
│   ├── tilt.js             # 3D card tilt effect
│   ├── gradients.js        # Animated gradient borders
│   ├── menu.js             # Animated menu
│   └── main.js             # Main application logic
└── README.md               # Documentation
```

## How to Use

### Basic Usage

Simply include the necessary files in your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="css/style.css">

<!-- JavaScript -->
<script src="js/particles.js"></script>
<script src="js/theme.js"></script>
<script src="js/tilt.js"></script>
<script src="js/gradients.js"></script>
<script src="js/menu.js"></script>
<script src="js/main.js"></script>
<script src="index.js"></script>
```

### API Usage

The project provides a clean API for controlling all effects:

```javascript
// Initialize with custom options
DesignShowcase.init({
  particles: {
    particleCount: 50,
    particleColors: ['#ff0000', '#00ff00', '#0000ff']
  },
  tiltEffect: {
    maxTilt: 20,
    glare: true
  }
});

// Toggle theme
DesignShowcase.theme.toggle();

// Add more particles
DesignShowcase.particles.add(10);

// Update tilt settings
DesignShowcase.tilt.updateSettings({
  maxTilt: 25,
  maxGlare: 0.5
});
```

## Effects Breakdown

### Particles

The particle system creates interactive dots that follow your cursor. Customize:

- Number of particles
- Size range
- Colors
- Speed
- Follow distance

### Theme Switching

Smooth transition between light and dark themes with:

- Beautiful cross-fade effect
- Local storage persistence
- System preference detection

### 3D Card Tilt

Cards that tilt in 3D space based on cursor position:

- Realistic perspective and rotation
- Dynamic lighting effect
- Customizable tilt angle and glare

### Gradient Borders

Animated borders with:

- Moving gradients
- Random movement patterns
- Pulsing glow effects

### Animated Menu

Responsive navigation with:

- Smooth open/close animations
- Staggered item animations
- Active state tracking
- Smooth scrolling

## Browser Compatibility

This showcase is designed to work in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Font Awesome for icons
- Inter font family

## License

MIT License - Feel free to use this code for personal and commercial projects.

---

Created as a showcase of modern web design techniques and interactive effects. 
