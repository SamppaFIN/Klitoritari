/**
 * 🚀 Advanced Components Part 2
 * Additional sophisticated UI components
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🎯 Rating Component
 */
class RatingComponent extends BaseComponent {
    constructor() {
        super('Rating', 'Star rating system with interactive feedback', 'rating');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'rating-container';
        
        const label = document.createElement('label');
        label.textContent = 'Rating';
        label.className = 'rating-label';
        
        const rating = document.createElement('div');
        rating.className = 'vanilla-rating';
        
        const stars = document.createElement('div');
        stars.className = 'rating-stars';
        stars.id = 'rating-stars';
        
        const value = document.createElement('div');
        value.className = 'rating-value';
        value.innerHTML = '<span id="rating-score">0</span> / 5 stars';
        
        const controls = document.createElement('div');
        controls.className = 'rating-controls';
        controls.innerHTML = `
            <button class="rating-btn" id="clear-rating">Clear</button>
            <button class="rating-btn" id="set-rating-5">Set 5 Stars</button>
        `;
        
        rating.appendChild(stars);
        rating.appendChild(value);
        rating.appendChild(controls);
        container.appendChild(label);
        container.appendChild(rating);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'rating-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Rating`;
        label.className = 'rating-label';
        
        const rating = document.createElement('div');
        rating.className = `library-rating ${libraryId}-rating`;
        
        const stars = document.createElement('div');
        stars.className = 'rating-stars';
        stars.id = 'rating-stars-lib';
        
        const value = document.createElement('div');
        value.className = 'rating-value';
        value.innerHTML = '<span id="rating-score-lib">0</span> / 5 stars';
        
        const controls = document.createElement('div');
        controls.className = 'rating-controls';
        controls.innerHTML = `
            <button class="rating-btn" id="clear-rating-lib">Clear</button>
            <button class="rating-btn" id="set-rating-5-lib">Set 5 Stars</button>
        `;
        
        rating.appendChild(stars);
        rating.appendChild(value);
        rating.appendChild(controls);
        container.appendChild(label);
        container.appendChild(rating);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const stars = element.querySelector('#rating-stars');
        const clearBtn = element.querySelector('#clear-rating');
        const set5Btn = element.querySelector('#set-rating-5');
        const score = element.querySelector('#rating-score');
        
        this.initRating(element);
        
        clearBtn.addEventListener('click', () => {
            this.clearRating(element);
        });
        
        set5Btn.addEventListener('click', () => {
            this.setRating(element, 5);
        });
        
        stars.addEventListener('click', (e) => {
            if (e.target.classList.contains('rating-star')) {
                const value = parseInt(e.target.dataset.value);
                this.setRating(element, value);
            }
        });
        
        stars.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('rating-star')) {
                const value = parseInt(e.target.dataset.value);
                this.highlightStars(element, value);
            }
        });
        
        stars.addEventListener('mouseleave', () => {
            this.updateStars(element);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const stars = element.querySelector('#rating-stars-lib');
        const clearBtn = element.querySelector('#clear-rating-lib');
        const set5Btn = element.querySelector('#set-rating-5-lib');
        const score = element.querySelector('#rating-score-lib');
        
        this.initRating(element);
        
        clearBtn.addEventListener('click', () => {
            this.clearRating(element);
        });
        
        set5Btn.addEventListener('click', () => {
            this.setRating(element, 5);
        });
        
        stars.addEventListener('click', (e) => {
            if (e.target.classList.contains('rating-star')) {
                const value = parseInt(e.target.dataset.value);
                this.setRating(element, value);
            }
        });
        
        stars.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('rating-star')) {
                const value = parseInt(e.target.dataset.value);
                this.highlightStars(element, value);
            }
        });
        
        stars.addEventListener('mouseleave', () => {
            this.updateStars(element);
        });
    }
    
    initRating(element) {
        element.ratingData = {
            currentRating: 0,
            maxRating: 5,
            isHovering: false
        };
        
        this.createStars(element);
    }
    
    createStars(element) {
        const stars = element.querySelector('[id*="rating-stars"]');
        stars.innerHTML = '';
        
        for (let i = 1; i <= element.ratingData.maxRating; i++) {
            const star = document.createElement('span');
            star.className = 'rating-star';
            star.dataset.value = i;
            star.innerHTML = '★';
            stars.appendChild(star);
        }
        
        this.updateStars(element);
    }
    
    setRating(element, value) {
        element.ratingData.currentRating = value;
        this.updateStars(element);
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('ratingChanged', {
            detail: { rating: value }
        }));
    }
    
    clearRating(element) {
        element.ratingData.currentRating = 0;
        this.updateStars(element);
    }
    
    highlightStars(element, value) {
        const stars = element.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('highlighted');
            } else {
                star.classList.remove('highlighted');
            }
        });
    }
    
    updateStars(element) {
        const data = element.ratingData;
        const stars = element.querySelectorAll('.rating-star');
        const score = element.querySelector('[id*="rating-score"]');
        
        stars.forEach((star, index) => {
            star.classList.remove('active', 'highlighted');
            if (index < data.currentRating) {
                star.classList.add('active');
            }
        });
        
        score.textContent = data.currentRating;
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('rating', `
            .rating-container {
                margin: 1rem 0;
            }
            
            .rating-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-rating {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
            }
            
            .rating-stars {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .rating-star {
                font-size: 2rem;
                color: var(--cosmic-neutral);
                cursor: pointer;
                transition: all 0.3s ease;
                user-select: none;
            }
            
            .rating-star:hover {
                transform: scale(1.2);
            }
            
            .rating-star.active {
                color: var(--cosmic-accent);
            }
            
            .rating-star.highlighted {
                color: var(--cosmic-primary);
            }
            
            .rating-value {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 1.1rem;
                margin-bottom: 1rem;
            }
            
            .rating-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .rating-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .rating-btn:hover {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('rating-library', `
            .library-rating {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
            }
        `);
    }
}

/**
 * 🎨 Color Picker Component
 */
class ColorPickerComponent extends BaseComponent {
    constructor() {
        super('Color Picker', 'Interactive color selection tool', 'color-picker');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'colorpicker-container';
        
        const label = document.createElement('label');
        label.textContent = 'Color Picker';
        label.className = 'colorpicker-label';
        
        const colorpicker = document.createElement('div');
        colorpicker.className = 'vanilla-colorpicker';
        
        const preview = document.createElement('div');
        preview.className = 'colorpicker-preview';
        preview.innerHTML = `
            <div class="color-preview" id="color-preview"></div>
            <div class="color-value" id="color-value">#4a9eff</div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'colorpicker-controls';
        controls.innerHTML = `
            <div class="color-input-group">
                <label>Red:</label>
                <input type="range" min="0" max="255" value="74" id="red-slider" class="color-slider">
                <input type="number" min="0" max="255" value="74" id="red-input" class="color-input">
            </div>
            <div class="color-input-group">
                <label>Green:</label>
                <input type="range" min="0" max="255" value="158" id="green-slider" class="color-slider">
                <input type="number" min="0" max="255" value="158" id="green-input" class="color-input">
            </div>
            <div class="color-input-group">
                <label>Blue:</label>
                <input type="range" min="0" max="255" value="255" id="blue-slider" class="color-slider">
                <input type="number" min="0" max="255" value="255" id="blue-input" class="color-input">
            </div>
        `;
        
        const presets = document.createElement('div');
        presets.className = 'colorpicker-presets';
        presets.innerHTML = `
            <h4>Preset Colors</h4>
            <div class="preset-colors" id="preset-colors">
                <div class="preset-color" data-color="#4a9eff" style="background: #4a9eff;"></div>
                <div class="preset-color" data-color="#00ff88" style="background: #00ff88;"></div>
                <div class="preset-color" data-color="#ff6b6b" style="background: #ff6b6b;"></div>
                <div class="preset-color" data-color="#ffd93d" style="background: #ffd93d;"></div>
                <div class="preset-color" data-color="#6c5ce7" style="background: #6c5ce7;"></div>
                <div class="preset-color" data-color="#a29bfe" style="background: #a29bfe;"></div>
            </div>
        `;
        
        colorpicker.appendChild(preview);
        colorpicker.appendChild(controls);
        colorpicker.appendChild(presets);
        container.appendChild(label);
        container.appendChild(colorpicker);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'colorpicker-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Color Picker`;
        label.className = 'colorpicker-label';
        
        const colorpicker = document.createElement('div');
        colorpicker.className = `library-colorpicker ${libraryId}-colorpicker`;
        
        const preview = document.createElement('div');
        preview.className = 'colorpicker-preview';
        preview.innerHTML = `
            <div class="color-preview" id="color-preview-lib"></div>
            <div class="color-value" id="color-value-lib">#4a9eff</div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'colorpicker-controls';
        controls.innerHTML = `
            <div class="color-input-group">
                <label>Red:</label>
                <input type="range" min="0" max="255" value="74" id="red-slider-lib" class="color-slider">
                <input type="number" min="0" max="255" value="74" id="red-input-lib" class="color-input">
            </div>
            <div class="color-input-group">
                <label>Green:</label>
                <input type="range" min="0" max="255" value="158" id="green-slider-lib" class="color-slider">
                <input type="number" min="0" max="255" value="158" id="green-input-lib" class="color-input">
            </div>
            <div class="color-input-group">
                <label>Blue:</label>
                <input type="range" min="0" max="255" value="255" id="blue-slider-lib" class="color-slider">
                <input type="number" min="0" max="255" value="255" id="blue-input-lib" class="color-input">
            </div>
        `;
        
        const presets = document.createElement('div');
        presets.className = 'colorpicker-presets';
        presets.innerHTML = `
            <h4>Preset Colors</h4>
            <div class="preset-colors" id="preset-colors-lib">
                <div class="preset-color" data-color="#4a9eff" style="background: #4a9eff;"></div>
                <div class="preset-color" data-color="#00ff88" style="background: #00ff88;"></div>
                <div class="preset-color" data-color="#ff6b6b" style="background: #ff6b6b;"></div>
                <div class="preset-color" data-color="#ffd93d" style="background: #ffd93d;"></div>
                <div class="preset-color" data-color="#6c5ce7" style="background: #6c5ce7;"></div>
                <div class="preset-color" data-color="#a29bfe" style="background: #a29bfe;"></div>
            </div>
        `;
        
        colorpicker.appendChild(preview);
        colorpicker.appendChild(controls);
        colorpicker.appendChild(presets);
        container.appendChild(label);
        container.appendChild(colorpicker);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const redSlider = element.querySelector('#red-slider');
        const greenSlider = element.querySelector('#green-slider');
        const blueSlider = element.querySelector('#blue-slider');
        const redInput = element.querySelector('#red-input');
        const greenInput = element.querySelector('#green-input');
        const blueInput = element.querySelector('#blue-input');
        const presetColors = element.querySelector('#preset-colors');
        
        this.initColorPicker(element);
        
        // Slider events
        [redSlider, greenSlider, blueSlider].forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateColorFromSliders(element);
            });
        });
        
        // Input events
        [redInput, greenInput, blueInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateColorFromInputs(element);
            });
        });
        
        // Preset color events
        presetColors.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-color')) {
                const color = e.target.dataset.color;
                this.setColor(element, color);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const redSlider = element.querySelector('#red-slider-lib');
        const greenSlider = element.querySelector('#green-slider-lib');
        const blueSlider = element.querySelector('#blue-slider-lib');
        const redInput = element.querySelector('#red-input-lib');
        const greenInput = element.querySelector('#green-input-lib');
        const blueInput = element.querySelector('#blue-input-lib');
        const presetColors = element.querySelector('#preset-colors-lib');
        
        this.initColorPicker(element);
        
        [redSlider, greenSlider, blueSlider].forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateColorFromSliders(element);
            });
        });
        
        [redInput, greenInput, blueInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateColorFromInputs(element);
            });
        });
        
        presetColors.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-color')) {
                const color = e.target.dataset.color;
                this.setColor(element, color);
            }
        });
    }
    
    initColorPicker(element) {
        element.colorData = {
            red: 74,
            green: 158,
            blue: 255
        };
        
        this.updateColor(element);
    }
    
    updateColorFromSliders(element) {
        const data = element.colorData;
        const redSlider = element.querySelector('[id*="red-slider"]');
        const greenSlider = element.querySelector('[id*="green-slider"]');
        const blueSlider = element.querySelector('[id*="blue-slider"]');
        const redInput = element.querySelector('[id*="red-input"]');
        const greenInput = element.querySelector('[id*="green-input"]');
        const blueInput = element.querySelector('[id*="blue-input"]');
        
        data.red = parseInt(redSlider.value);
        data.green = parseInt(greenSlider.value);
        data.blue = parseInt(blueSlider.value);
        
        redInput.value = data.red;
        greenInput.value = data.green;
        blueInput.value = data.blue;
        
        this.updateColor(element);
    }
    
    updateColorFromInputs(element) {
        const data = element.colorData;
        const redInput = element.querySelector('[id*="red-input"]');
        const greenInput = element.querySelector('[id*="green-input"]');
        const blueInput = element.querySelector('[id*="blue-input"]');
        const redSlider = element.querySelector('[id*="red-slider"]');
        const greenSlider = element.querySelector('[id*="green-slider"]');
        const blueSlider = element.querySelector('[id*="blue-slider"]');
        
        data.red = Math.max(0, Math.min(255, parseInt(redInput.value) || 0));
        data.green = Math.max(0, Math.min(255, parseInt(greenInput.value) || 0));
        data.blue = Math.max(0, Math.min(255, parseInt(blueInput.value) || 0));
        
        redSlider.value = data.red;
        greenSlider.value = data.green;
        blueSlider.value = data.blue;
        
        this.updateColor(element);
    }
    
    setColor(element, hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (rgb) {
            element.colorData.red = rgb.r;
            element.colorData.green = rgb.g;
            element.colorData.blue = rgb.b;
            
            this.updateAllInputs(element);
            this.updateColor(element);
        }
    }
    
    updateAllInputs(element) {
        const data = element.colorData;
        const redSlider = element.querySelector('[id*="red-slider"]');
        const greenSlider = element.querySelector('[id*="green-slider"]');
        const blueSlider = element.querySelector('[id*="blue-slider"]');
        const redInput = element.querySelector('[id*="red-input"]');
        const greenInput = element.querySelector('[id*="green-input"]');
        const blueInput = element.querySelector('[id*="blue-input"]');
        
        redSlider.value = data.red;
        greenSlider.value = data.green;
        blueSlider.value = data.blue;
        redInput.value = data.red;
        greenInput.value = data.green;
        blueInput.value = data.blue;
    }
    
    updateColor(element) {
        const data = element.colorData;
        const preview = element.querySelector('[id*="color-preview"]');
        const value = element.querySelector('[id*="color-value"]');
        
        const hexColor = this.rgbToHex(data.red, data.green, data.blue);
        
        preview.style.backgroundColor = hexColor;
        value.textContent = hexColor;
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('colorChanged', {
            detail: { 
                hex: hexColor,
                rgb: { r: data.red, g: data.green, b: data.blue }
            }
        }));
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('colorpicker', `
            .colorpicker-container {
                margin: 1rem 0;
            }
            
            .colorpicker-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-colorpicker {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
            
            .colorpicker-preview {
                text-align: center;
                margin-bottom: 1.5rem;
            }
            
            .color-preview {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin: 0 auto 1rem;
                border: 3px solid var(--cosmic-neutral);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .color-value {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .colorpicker-controls {
                margin-bottom: 1.5rem;
            }
            
            .color-input-group {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .color-input-group label {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 50px;
            }
            
            .color-slider {
                flex: 1;
                height: 6px;
                background: var(--cosmic-neutral);
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
            }
            
            .color-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
            }
            
            .color-input {
                width: 60px;
                padding: 0.5rem;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 4px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                text-align: center;
            }
            
            .colorpicker-presets h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
                text-align: center;
            }
            
            .preset-colors {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
            }
            
            .preset-color {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .preset-color:hover {
                transform: scale(1.2);
                border-color: var(--cosmic-light);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('colorpicker-library', `
            .library-colorpicker {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
            }
        `);
    }
}

/**
 * 🎪 Stepper Component
 */
class StepperComponent extends BaseComponent {
    constructor() {
        super('Stepper', 'Step-by-step progress indicator', 'stepper');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'stepper-container';
        
        const label = document.createElement('label');
        label.textContent = 'Stepper';
        label.className = 'stepper-label';
        
        const stepper = document.createElement('div');
        stepper.className = 'vanilla-stepper';
        
        const steps = document.createElement('div');
        steps.className = 'stepper-steps';
        steps.id = 'stepper-steps';
        
        const content = document.createElement('div');
        content.className = 'stepper-content';
        content.id = 'stepper-content';
        
        const controls = document.createElement('div');
        controls.className = 'stepper-controls';
        controls.innerHTML = `
            <button class="stepper-btn" id="prev-step">Previous</button>
            <button class="stepper-btn" id="next-step">Next</button>
            <button class="stepper-btn" id="reset-stepper">Reset</button>
        `;
        
        stepper.appendChild(steps);
        stepper.appendChild(content);
        stepper.appendChild(controls);
        container.appendChild(label);
        container.appendChild(stepper);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'stepper-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Stepper`;
        label.className = 'stepper-label';
        
        const stepper = document.createElement('div');
        stepper.className = `library-stepper ${libraryId}-stepper`;
        
        const steps = document.createElement('div');
        steps.className = 'stepper-steps';
        steps.id = 'stepper-steps-lib';
        
        const content = document.createElement('div');
        content.className = 'stepper-content';
        content.id = 'stepper-content-lib';
        
        const controls = document.createElement('div');
        controls.className = 'stepper-controls';
        controls.innerHTML = `
            <button class="stepper-btn" id="prev-step-lib">Previous</button>
            <button class="stepper-btn" id="next-step-lib">Next</button>
            <button class="stepper-btn" id="reset-stepper-lib">Reset</button>
        `;
        
        stepper.appendChild(steps);
        stepper.appendChild(content);
        stepper.appendChild(controls);
        container.appendChild(label);
        container.appendChild(stepper);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const prevBtn = element.querySelector('#prev-step');
        const nextBtn = element.querySelector('#next-step');
        const resetBtn = element.querySelector('#reset-stepper');
        const steps = element.querySelector('#stepper-steps');
        
        this.initStepper(element);
        
        prevBtn.addEventListener('click', () => {
            this.previousStep(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextStep(element);
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetStepper(element);
        });
        
        steps.addEventListener('click', (e) => {
            if (e.target.classList.contains('stepper-step')) {
                const stepIndex = parseInt(e.target.dataset.step);
                this.goToStep(element, stepIndex);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const prevBtn = element.querySelector('#prev-step-lib');
        const nextBtn = element.querySelector('#next-step-lib');
        const resetBtn = element.querySelector('#reset-stepper-lib');
        const steps = element.querySelector('#stepper-steps-lib');
        
        this.initStepper(element);
        
        prevBtn.addEventListener('click', () => {
            this.previousStep(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextStep(element);
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetStepper(element);
        });
        
        steps.addEventListener('click', (e) => {
            if (e.target.classList.contains('stepper-step')) {
                const stepIndex = parseInt(e.target.dataset.step);
                this.goToStep(element, stepIndex);
            }
        });
    }
    
    initStepper(element) {
        element.stepperData = {
            currentStep: 0,
            totalSteps: 4,
            steps: [
                { title: 'Welcome', content: 'Welcome to our amazing process!', completed: false },
                { title: 'Information', content: 'Please provide your information.', completed: false },
                { title: 'Verification', content: 'Verify your details are correct.', completed: false },
                { title: 'Complete', content: 'You have successfully completed all steps!', completed: false }
            ]
        };
        
        this.renderStepper(element);
    }
    
    renderStepper(element) {
        const data = element.stepperData;
        const stepsContainer = element.querySelector('[id*="stepper-steps"]');
        const contentContainer = element.querySelector('[id*="stepper-content"]');
        
        // Render steps
        stepsContainer.innerHTML = '';
        data.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'stepper-step';
            stepElement.dataset.step = index;
            
            if (index === data.currentStep) {
                stepElement.classList.add('active');
            } else if (index < data.currentStep) {
                stepElement.classList.add('completed');
            }
            
            stepElement.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-title">${step.title}</div>
            `;
            
            stepsContainer.appendChild(stepElement);
        });
        
        // Render content
        const currentStepData = data.steps[data.currentStep];
        contentContainer.innerHTML = `
            <h3>${currentStepData.title}</h3>
            <p>${currentStepData.content}</p>
        `;
        
        // Update controls
        const prevBtn = element.querySelector('[id*="prev-step"]');
        const nextBtn = element.querySelector('[id*="next-step"]');
        
        prevBtn.disabled = data.currentStep === 0;
        nextBtn.disabled = data.currentStep === data.totalSteps - 1;
        
        if (data.currentStep === data.totalSteps - 1) {
            nextBtn.textContent = 'Complete';
        } else {
            nextBtn.textContent = 'Next';
        }
    }
    
    previousStep(element) {
        const data = element.stepperData;
        if (data.currentStep > 0) {
            data.currentStep--;
            this.renderStepper(element);
        }
    }
    
    nextStep(element) {
        const data = element.stepperData;
        if (data.currentStep < data.totalSteps - 1) {
            data.steps[data.currentStep].completed = true;
            data.currentStep++;
            this.renderStepper(element);
        } else {
            // Complete the stepper
            data.steps[data.currentStep].completed = true;
            this.completeStepper(element);
        }
    }
    
    goToStep(element, stepIndex) {
        const data = element.stepperData;
        if (stepIndex >= 0 && stepIndex < data.totalSteps) {
            data.currentStep = stepIndex;
            this.renderStepper(element);
        }
    }
    
    resetStepper(element) {
        const data = element.stepperData;
        data.currentStep = 0;
        data.steps.forEach(step => {
            step.completed = false;
        });
        this.renderStepper(element);
    }
    
    completeStepper(element) {
        const contentContainer = element.querySelector('[id*="stepper-content"]');
        contentContainer.innerHTML = `
            <div class="stepper-complete">
                <h3>🎉 Congratulations!</h3>
                <p>You have successfully completed all steps!</p>
            </div>
        `;
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('stepperComplete', {
            detail: { totalSteps: element.stepperData.totalSteps }
        }));
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('stepper', `
            .stepper-container {
                margin: 1rem 0;
            }
            
            .stepper-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-stepper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
            
            .stepper-steps {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2rem;
                position: relative;
            }
            
            .stepper-steps::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--cosmic-neutral);
                z-index: 1;
            }
            
            .stepper-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                position: relative;
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            .step-number {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-primary);
                font-weight: 600;
                margin-bottom: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .stepper-step.active .step-number {
                background: var(--cosmic-primary);
                transform: scale(1.1);
            }
            
            .stepper-step.completed .step-number {
                background: var(--cosmic-accent);
            }
            
            .stepper-step.completed .step-number::after {
                content: '✓';
                color: var(--cosmic-dark);
            }
            
            .step-title {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                text-align: center;
            }
            
            .stepper-content {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 2rem;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .stepper-content h3 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .stepper-content p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                margin: 0;
            }
            
            .stepper-complete {
                text-align: center;
            }
            
            .stepper-complete h3 {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
                font-size: 1.5rem;
            }
            
            .stepper-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .stepper-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .stepper-btn:hover:not(:disabled) {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            .stepper-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('stepper-library', `
            .library-stepper {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RatingComponent,
        ColorPickerComponent,
        StepperComponent
    };
}
