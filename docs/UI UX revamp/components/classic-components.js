/**
 * 🎯 Classic Components
 * Fundamental UI components implemented in vanilla.js vs libraries
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 📝 Text Input Component
 */
class TextInputComponent extends BaseComponent {
    constructor() {
        super('Text Input', 'Single-line text input field', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'text-input-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input vanilla-input';
        input.placeholder = this.options.placeholder || 'Enter text...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = this.options.id;
        
        const label = document.createElement('label');
        label.textContent = 'Text Input';
        label.htmlFor = this.options.id;
        label.className = 'input-label';
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'text-input-container';
        
        // Simulate library component
        const input = document.createElement('input');
        input.type = 'text';
        input.className = `text-input library-input ${libraryId}-input`;
        input.placeholder = this.options.placeholder || 'Enter text...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = `${this.options.id}-library`;
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Text Input`;
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'input-label';
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const input = element.querySelector('.vanilla-input');
        
        input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        input.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const input = element.querySelector('.library-input');
        
        input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        input.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    handleInput(value) {
        console.log('Text input changed:', value);
    }
    
    handleFocus(element) {
        element.classList.add('focused');
    }
    
    handleBlur(element) {
        element.classList.remove('focused');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('text-input', `
            .text-input-container {
                margin: 1rem 0;
            }
            
            .input-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .vanilla-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .vanilla-input:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .vanilla-input.focused {
                border-color: var(--cosmic-accent);
                box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('text-input-library', `
            .library-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .library-input:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
            
            .library-input:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `);
    }
}

/**
 * 🔘 Button Component
 */
class ButtonComponent extends BaseComponent {
    constructor() {
        super('Button', 'Interactive button element', 'classic');
    }
    
    createVanillaElement() {
        const button = document.createElement('button');
        button.className = 'vanilla-button';
        button.textContent = this.options.text || 'Click Me';
        button.disabled = this.options.disabled;
        button.id = this.options.id;
        
        return button;
    }
    
    createLibraryElement(libraryId) {
        const button = document.createElement('button');
        button.className = `library-button ${libraryId}-button`;
        button.textContent = `${libraryId.toUpperCase()} Button`;
        button.disabled = this.options.disabled;
        button.id = `${this.options.id}-library`;
        
        return button;
    }
    
    setupVanillaEventListeners(element) {
        element.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        element.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e.target);
        });
        
        element.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e.target);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        element.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        element.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e.target);
        });
        
        element.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e.target);
        });
    }
    
    handleClick(event) {
        console.log('Button clicked!');
        this.createRippleEffect(event.target, event);
    }
    
    handleMouseEnter(element) {
        element.classList.add('hovered');
    }
    
    handleMouseLeave(element) {
        element.classList.remove('hovered');
    }
    
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('button', `
            .vanilla-button {
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--cosmic-primary), var(--cosmic-secondary));
                color: white;
                border: none;
                border-radius: 8px;
                font-family: var(--font-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                user-select: none;
            }
            
            .vanilla-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(74, 158, 255, 0.3);
            }
            
            .vanilla-button:active {
                transform: translateY(0);
            }
            
            .vanilla-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .vanilla-button.hovered {
                background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-primary));
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('button-library', `
            .library-button {
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--cosmic-secondary), var(--cosmic-accent));
                color: white;
                border: none;
                border-radius: 8px;
                font-family: var(--font-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .library-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
            }
            
            .library-button:active {
                transform: translateY(0);
            }
            
            .library-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
        `);
    }
}

/**
 * ☑️ Checkbox Component
 */
class CheckboxComponent extends BaseComponent {
    constructor() {
        super('Checkbox', 'Binary choice input element', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'vanilla-checkbox';
        checkbox.checked = this.options.checked || false;
        checkbox.disabled = this.options.disabled;
        checkbox.id = this.options.id;
        
        const label = document.createElement('label');
        label.htmlFor = this.options.id;
        label.className = 'checkbox-label';
        label.textContent = this.options.label || 'Checkbox';
        
        container.appendChild(checkbox);
        container.appendChild(label);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = `library-checkbox ${libraryId}-checkbox`;
        checkbox.checked = this.options.checked || false;
        checkbox.disabled = this.options.disabled;
        checkbox.id = `${this.options.id}-library`;
        
        const label = document.createElement('label');
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'checkbox-label';
        label.textContent = `${libraryId.toUpperCase()} Checkbox`;
        
        container.appendChild(checkbox);
        container.appendChild(label);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const checkbox = element.querySelector('.vanilla-checkbox');
        
        checkbox.addEventListener('change', (e) => {
            this.handleChange(e.target.checked);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const checkbox = element.querySelector('.library-checkbox');
        
        checkbox.addEventListener('change', (e) => {
            this.handleChange(e.target.checked);
        });
    }
    
    handleChange(checked) {
        console.log('Checkbox changed:', checked);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('checkbox', `
            .checkbox-container {
                display: flex;
                align-items: center;
                margin: 1rem 0;
            }
            
            .vanilla-checkbox {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: var(--cosmic-primary);
            }
            
            .checkbox-label {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                cursor: pointer;
                user-select: none;
            }
            
            .vanilla-checkbox:checked + .checkbox-label {
                color: var(--cosmic-accent);
            }
            
            .vanilla-checkbox:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('checkbox-library', `
            .library-checkbox {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: var(--cosmic-secondary);
            }
            
            .library-checkbox:checked + .checkbox-label {
                color: var(--cosmic-secondary);
            }
        `);
    }
}

/**
 * 🔘 Radio Button Component
 */
class RadioButtonComponent extends BaseComponent {
    constructor() {
        super('Radio Button', 'Single choice from multiple options', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'radio-container';
        
        const options = this.options.options || ['Option 1', 'Option 2', 'Option 3'];
        
        options.forEach((option, index) => {
            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = this.options.name || 'vanilla-radio';
            radio.value = option.toLowerCase().replace(/\s+/g, '-');
            radio.className = 'vanilla-radio';
            radio.id = `${this.options.id}-${index}`;
            radio.checked = index === 0;
            radio.disabled = this.options.disabled;
            
            const label = document.createElement('label');
            label.htmlFor = `${this.options.id}-${index}`;
            label.className = 'radio-label';
            label.textContent = option;
            
            radioGroup.appendChild(radio);
            radioGroup.appendChild(label);
            container.appendChild(radioGroup);
        });
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'radio-container';
        
        const options = this.options.options || ['Option 1', 'Option 2', 'Option 3'];
        
        options.forEach((option, index) => {
            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `${libraryId}-radio`;
            radio.value = option.toLowerCase().replace(/\s+/g, '-');
            radio.className = `library-radio ${libraryId}-radio`;
            radio.id = `${this.options.id}-library-${index}`;
            radio.checked = index === 0;
            radio.disabled = this.options.disabled;
            
            const label = document.createElement('label');
            label.htmlFor = `${this.options.id}-library-${index}`;
            label.className = 'radio-label';
            label.textContent = option;
            
            radioGroup.appendChild(radio);
            radioGroup.appendChild(label);
            container.appendChild(radioGroup);
        });
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const radios = element.querySelectorAll('.vanilla-radio');
        
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleChange(e.target.value);
                }
            });
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const radios = element.querySelectorAll('.library-radio');
        
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleChange(e.target.value);
                }
            });
        });
    }
    
    handleChange(value) {
        console.log('Radio selection changed:', value);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('radio', `
            .radio-container {
                margin: 1rem 0;
            }
            
            .radio-group {
                display: flex;
                align-items: center;
                margin: 0.5rem 0;
            }
            
            .vanilla-radio {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: var(--cosmic-primary);
            }
            
            .radio-label {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                cursor: pointer;
                user-select: none;
            }
            
            .vanilla-radio:checked + .radio-label {
                color: var(--cosmic-accent);
            }
            
            .vanilla-radio:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('radio-library', `
            .library-radio {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: var(--cosmic-secondary);
            }
            
            .library-radio:checked + .radio-label {
                color: var(--cosmic-secondary);
            }
        `);
    }
}

/**
 * 📊 Slider Component
 */
class SliderComponent extends BaseComponent {
    constructor() {
        super('Slider', 'Range input for numeric values', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'slider-container';
        
        const label = document.createElement('label');
        label.textContent = 'Slider';
        label.className = 'slider-label';
        label.htmlFor = this.options.id;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'vanilla-slider';
        slider.min = this.options.min || 0;
        slider.max = this.options.max || 100;
        slider.value = this.options.value || 50;
        slider.step = this.options.step || 1;
        slider.disabled = this.options.disabled;
        slider.id = this.options.id;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = slider.value;
        
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'slider-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Slider`;
        label.className = 'slider-label';
        label.htmlFor = `${this.options.id}-library`;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = `library-slider ${libraryId}-slider`;
        slider.min = this.options.min || 0;
        slider.max = this.options.max || 100;
        slider.value = this.options.value || 50;
        slider.step = this.options.step || 1;
        slider.disabled = this.options.disabled;
        slider.id = `${this.options.id}-library`;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = slider.value;
        
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const slider = element.querySelector('.vanilla-slider');
        const valueDisplay = element.querySelector('.slider-value');
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            this.handleChange(e.target.value);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const slider = element.querySelector('.library-slider');
        const valueDisplay = element.querySelector('.slider-value');
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            this.handleChange(e.target.value);
        });
    }
    
    handleChange(value) {
        console.log('Slider value changed:', value);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('slider', `
            .slider-container {
                margin: 1rem 0;
            }
            
            .slider-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: var(--cosmic-neutral);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .vanilla-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--cosmic-primary);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .vanilla-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 0 8px rgba(74, 158, 255, 0.2);
            }
            
            .vanilla-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--cosmic-primary);
                cursor: pointer;
                border: none;
            }
            
            .slider-value {
                display: block;
                margin-top: 0.5rem;
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                text-align: center;
            }
            
            .vanilla-slider:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('slider-library', `
            .library-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: var(--cosmic-neutral);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .library-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--cosmic-secondary);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .library-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 0 8px rgba(138, 43, 226, 0.2);
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TextInputComponent,
        ButtonComponent,
        CheckboxComponent,
        RadioButtonComponent,
        SliderComponent
    };
}
