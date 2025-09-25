/**
 * 🎨 Creative Algorithms Components
 * Procedural generation and mathematical art algorithms
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🌸 Fractal Generator Component
 */
class FractalGeneratorComponent extends BaseComponent {
    constructor() {
        super('Fractal Generator', 'Mathematical fractal generation and visualization', 'creative');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'fractal-generator-container';
        
        const label = document.createElement('label');
        label.textContent = 'Fractal Generator';
        label.className = 'fractal-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'vanilla-fractal-canvas';
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'fractal-controls';
        controls.innerHTML = `
            <button class="fractal-btn" data-type="mandelbrot">🌀 Mandelbrot</button>
            <button class="fractal-btn" data-type="julia">🌊 Julia</button>
            <button class="fractal-btn" data-type="sierpinski">🔺 Sierpinski</button>
            <button class="fractal-btn" data-type="dragon">🐉 Dragon</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'fractal-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Iterations:</label>
                <input type="range" class="iterations-slider" min="50" max="500" value="100">
                <span class="iterations-value">100</span>
            </div>
            <div class="setting-group">
                <label>Zoom:</label>
                <input type="range" class="zoom-slider" min="1" max="10" step="0.1" value="1">
                <span class="zoom-value">1.0</span>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(settings);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'fractal-generator-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Fractal Generator`;
        label.className = 'fractal-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = `library-fractal-canvas ${libraryId}-fractal-canvas`;
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'fractal-controls';
        controls.innerHTML = `
            <button class="fractal-btn" data-type="mandelbrot">🌀 Mandelbrot</button>
            <button class="fractal-btn" data-type="julia">🌊 Julia</button>
            <button class="fractal-btn" data-type="sierpinski">🔺 Sierpinski</button>
            <button class="fractal-btn" data-type="dragon">🐉 Dragon</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'fractal-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Iterations:</label>
                <input type="range" class="iterations-slider" min="50" max="500" value="100">
                <span class="iterations-value">100</span>
            </div>
            <div class="setting-group">
                <label>Zoom:</label>
                <input type="range" class="zoom-slider" min="1" max="10" step="0.1" value="1">
                <span class="zoom-value">1.0</span>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(settings);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const canvas = element.querySelector('.vanilla-fractal-canvas');
        const controls = element.querySelectorAll('.fractal-btn');
        const iterationsSlider = element.querySelector('.iterations-slider');
        const zoomSlider = element.querySelector('.zoom-slider');
        
        // Initialize fractal system
        this.initFractalSystem(canvas);
        
        // Effect controls
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.generateFractal(canvas, e.target.dataset.type);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        // Settings controls
        iterationsSlider.addEventListener('input', (e) => {
            canvas.fractalData.iterations = parseInt(e.target.value);
            element.querySelector('.iterations-value').textContent = e.target.value;
            this.generateFractal(canvas, canvas.fractalData.type);
        });
        
        zoomSlider.addEventListener('input', (e) => {
            canvas.fractalData.zoom = parseFloat(e.target.value);
            element.querySelector('.zoom-value').textContent = e.target.value;
            this.generateFractal(canvas, canvas.fractalData.type);
        });
        
        // Mouse interaction for zooming
        canvas.addEventListener('click', (e) => {
            this.handleFractalClick(e, canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const canvas = element.querySelector('.library-fractal-canvas');
        const controls = element.querySelectorAll('.fractal-btn');
        const iterationsSlider = element.querySelector('.iterations-slider');
        const zoomSlider = element.querySelector('.zoom-slider');
        
        this.initFractalSystem(canvas);
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.generateFractal(canvas, e.target.dataset.type);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        iterationsSlider.addEventListener('input', (e) => {
            canvas.fractalData.iterations = parseInt(e.target.value);
            element.querySelector('.iterations-value').textContent = e.target.value;
            this.generateFractal(canvas, canvas.fractalData.type);
        });
        
        zoomSlider.addEventListener('input', (e) => {
            canvas.fractalData.zoom = parseFloat(e.target.value);
            element.querySelector('.zoom-value').textContent = e.target.value;
            this.generateFractal(canvas, canvas.fractalData.type);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleFractalClick(e, canvas);
        });
    }
    
    initFractalSystem(canvas) {
        canvas.fractalData = {
            type: 'mandelbrot',
            iterations: 100,
            zoom: 1.0,
            centerX: 0,
            centerY: 0
        };
        
        // Generate initial fractal
        this.generateFractal(canvas, 'mandelbrot');
    }
    
    generateFractal(canvas, type) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const data = canvas.fractalData;
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        // Show loading
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Generating fractal...', width / 2, height / 2);
        
        // Generate fractal in chunks to avoid blocking
        setTimeout(() => {
            this.renderFractal(canvas, type);
        }, 100);
    }
    
    renderFractal(canvas, type) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const data = canvas.fractalData;
        
        const imageData = ctx.createImageData(width, height);
        const pixels = imageData.data;
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const index = (y * width + x) * 4;
                let color;
                
                switch(type) {
                    case 'mandelbrot':
                        color = this.mandelbrotColor(x, y, width, height, data);
                        break;
                    case 'julia':
                        color = this.juliaColor(x, y, width, height, data);
                        break;
                    case 'sierpinski':
                        color = this.sierpinskiColor(x, y, width, height, data);
                        break;
                    case 'dragon':
                        color = this.dragonColor(x, y, width, height, data);
                        break;
                }
                
                pixels[index] = color.r;     // Red
                pixels[index + 1] = color.g; // Green
                pixels[index + 2] = color.b; // Blue
                pixels[index + 3] = 255;     // Alpha
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    mandelbrotColor(x, y, width, height, data) {
        const zoom = data.zoom;
        const centerX = data.centerX;
        const centerY = data.centerY;
        
        const real = (x - width / 2) / (width / 4) / zoom + centerX;
        const imag = (y - height / 2) / (height / 4) / zoom + centerY;
        
        let zReal = 0;
        let zImag = 0;
        let iterations = 0;
        
        while (iterations < data.iterations && zReal * zReal + zImag * zImag < 4) {
            const temp = zReal * zReal - zImag * zImag + real;
            zImag = 2 * zReal * zImag + imag;
            zReal = temp;
            iterations++;
        }
        
        return this.getFractalColor(iterations, data.iterations);
    }
    
    juliaColor(x, y, width, height, data) {
        const zoom = data.zoom;
        const centerX = data.centerX;
        const centerY = data.centerY;
        
        const real = (x - width / 2) / (width / 4) / zoom + centerX;
        const imag = (y - height / 2) / (height / 4) / zoom + centerY;
        
        // Julia set parameters
        const cReal = -0.7;
        const cImag = 0.27015;
        
        let zReal = real;
        let zImag = imag;
        let iterations = 0;
        
        while (iterations < data.iterations && zReal * zReal + zImag * zImag < 4) {
            const temp = zReal * zReal - zImag * zImag + cReal;
            zImag = 2 * zReal * zImag + cImag;
            zReal = temp;
            iterations++;
        }
        
        return this.getFractalColor(iterations, data.iterations);
    }
    
    sierpinskiColor(x, y, width, height, data) {
        const zoom = data.zoom;
        const iterations = Math.floor(data.iterations / 10);
        
        let px = x / width;
        let py = y / height;
        
        for (let i = 0; i < iterations; i++) {
            px *= 2;
            py *= 2;
            
            if (px > 1) px -= 1;
            if (py > 1) py -= 1;
            
            if (px > 0.5 && py > 0.5) {
                return { r: 0, g: 0, b: 0 };
            }
        }
        
        return { r: 255, g: 255, b: 255 };
    }
    
    dragonColor(x, y, width, height, data) {
        // Simplified dragon curve visualization
        const iterations = Math.floor(data.iterations / 20);
        const angle = (x / width) * Math.PI * 2;
        const radius = (y / height) * 100;
        
        let r = radius;
        let theta = angle;
        
        for (let i = 0; i < iterations; i++) {
            const newR = Math.sqrt(r * r + 1);
            const newTheta = theta + Math.atan(1 / r);
            r = newR;
            theta = newTheta;
        }
        
        const intensity = Math.sin(theta * 10) * 0.5 + 0.5;
        return {
            r: Math.floor(intensity * 255),
            g: Math.floor(intensity * 128),
            b: Math.floor(intensity * 64)
        };
    }
    
    getFractalColor(iterations, maxIterations) {
        if (iterations === maxIterations) {
            return { r: 0, g: 0, b: 0 };
        }
        
        const ratio = iterations / maxIterations;
        const hue = ratio * 360;
        const saturation = 100;
        const lightness = 50;
        
        return this.hslToRgb(hue, saturation, lightness);
    }
    
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    handleFractalClick(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert to fractal coordinates
        const width = canvas.width;
        const height = canvas.height;
        const data = canvas.fractalData;
        
        data.centerX = (x - width / 2) / (width / 4) / data.zoom + data.centerX;
        data.centerY = (y - height / 2) / (height / 4) / data.zoom + data.centerY;
        data.zoom *= 2;
        
        this.generateFractal(canvas, data.type);
    }
    
    updateActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('fractal-generator', `
            .fractal-generator-container {
                margin: 1rem 0;
            }
            
            .fractal-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-fractal-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: #000;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
            
            .fractal-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .fractal-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .fractal-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .fractal-btn.active {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
            
            .fractal-settings {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .setting-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .setting-group label {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                min-width: 60px;
            }
            
            .iterations-slider,
            .zoom-slider {
                width: 100px;
                height: 4px;
                background: var(--cosmic-neutral);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
            }
            
            .iterations-slider::-webkit-slider-thumb,
            .zoom-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
            }
            
            .iterations-value,
            .zoom-value {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 40px;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('fractal-generator-library', `
            .library-fractal-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: #000;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FractalGeneratorComponent
    };
}
