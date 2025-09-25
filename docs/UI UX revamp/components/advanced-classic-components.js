/**
 * 🎯 Advanced Classic Components
 * Additional classic UI components implemented in vanilla.js vs libraries
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🔒 Password Input Component
 */
class PasswordInputComponent extends BaseComponent {
    constructor() {
        super('Password Input', 'Secure password input with strength indicator', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'password-input-container';
        
        const label = document.createElement('label');
        label.textContent = 'Password';
        label.htmlFor = this.options.id;
        label.className = 'input-label';
        
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'password-input-wrapper';
        
        const input = document.createElement('input');
        input.type = 'password';
        input.className = 'vanilla-password-input';
        input.placeholder = this.options.placeholder || 'Enter password...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = this.options.id;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <div class="strength-text">Password strength</div>
        `;
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(toggleBtn);
        container.appendChild(label);
        container.appendChild(inputWrapper);
        container.appendChild(strengthIndicator);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'password-input-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Password`;
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'input-label';
        
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'password-input-wrapper';
        
        const input = document.createElement('input');
        input.type = 'password';
        input.className = `library-password-input ${libraryId}-password-input`;
        input.placeholder = this.options.placeholder || 'Enter password...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = `${this.options.id}-library`;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <div class="strength-text">Password strength</div>
        `;
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(toggleBtn);
        container.appendChild(label);
        container.appendChild(inputWrapper);
        container.appendChild(strengthIndicator);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const input = element.querySelector('.vanilla-password-input');
        const toggleBtn = element.querySelector('.password-toggle');
        const strengthFill = element.querySelector('.strength-fill');
        const strengthText = element.querySelector('.strength-text');
        
        // Toggle password visibility
        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ? '🙈' : '👁️';
        });
        
        // Password strength calculation
        input.addEventListener('input', (e) => {
            const strength = this.calculatePasswordStrength(e.target.value);
            this.updateStrengthIndicator(strengthFill, strengthText, strength);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        input.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const input = element.querySelector('.library-password-input');
        const toggleBtn = element.querySelector('.password-toggle');
        const strengthFill = element.querySelector('.strength-fill');
        const strengthText = element.querySelector('.strength-text');
        
        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ? '🙈' : '👁️';
        });
        
        input.addEventListener('input', (e) => {
            const strength = this.calculatePasswordStrength(e.target.value);
            this.updateStrengthIndicator(strengthFill, strengthText, strength);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        input.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };
        
        score = Object.values(checks).filter(Boolean).length;
        
        return {
            score,
            percentage: (score / 5) * 100,
            level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
            checks
        };
    }
    
    updateStrengthIndicator(fill, text, strength) {
        fill.style.width = `${strength.percentage}%`;
        
        const colors = {
            weak: '#ff3366',
            medium: '#ff6b35',
            strong: '#00ff88'
        };
        
        fill.style.backgroundColor = colors[strength.level];
        text.textContent = `Password strength: ${strength.level}`;
        text.style.color = colors[strength.level];
    }
    
    handleFocus(element) {
        element.classList.add('focused');
    }
    
    handleBlur(element) {
        element.classList.remove('focused');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('password-input', `
            .password-input-container {
                margin: 1rem 0;
            }
            
            .password-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .vanilla-password-input {
                width: 100%;
                padding: 12px 50px 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .vanilla-password-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .password-toggle {
                position: absolute;
                right: 12px;
                background: none;
                border: none;
                color: var(--cosmic-neutral);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                font-size: 1.2rem;
            }
            
            .password-toggle:hover {
                color: var(--cosmic-light);
                background: var(--cosmic-neutral);
            }
            
            .password-strength {
                margin-top: 0.5rem;
            }
            
            .strength-bar {
                width: 100%;
                height: 4px;
                background: var(--cosmic-neutral);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 0.25rem;
            }
            
            .strength-fill {
                height: 100%;
                width: 0%;
                background: var(--cosmic-danger);
                transition: all 0.3s ease;
                border-radius: 2px;
            }
            
            .strength-text {
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                color: var(--cosmic-neutral);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('password-input-library', `
            .library-password-input {
                width: 100%;
                padding: 12px 50px 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .library-password-input:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

/**
 * 📧 Email Input Component
 */
class EmailInputComponent extends BaseComponent {
    constructor() {
        super('Email Input', 'Email validation and formatting', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'email-input-container';
        
        const label = document.createElement('label');
        label.textContent = 'Email';
        label.htmlFor = this.options.id;
        label.className = 'input-label';
        
        const input = document.createElement('input');
        input.type = 'email';
        input.className = 'vanilla-email-input';
        input.placeholder = this.options.placeholder || 'Enter email...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = this.options.id;
        
        const validationMessage = document.createElement('div');
        validationMessage.className = 'email-validation';
        validationMessage.style.display = 'none';
        
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(validationMessage);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'email-input-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Email`;
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'input-label';
        
        const input = document.createElement('input');
        input.type = 'email';
        input.className = `library-email-input ${libraryId}-email-input`;
        input.placeholder = this.options.placeholder || 'Enter email...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.required = this.options.required;
        input.id = `${this.options.id}-library`;
        
        const validationMessage = document.createElement('div');
        validationMessage.className = 'email-validation';
        validationMessage.style.display = 'none';
        
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(validationMessage);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const input = element.querySelector('.vanilla-email-input');
        const validationMessage = element.querySelector('.email-validation');
        
        input.addEventListener('input', (e) => {
            this.validateEmail(e.target.value, validationMessage);
        });
        
        input.addEventListener('blur', (e) => {
            this.validateEmail(e.target.value, validationMessage, true);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const input = element.querySelector('.library-email-input');
        const validationMessage = element.querySelector('.email-validation');
        
        input.addEventListener('input', (e) => {
            this.validateEmail(e.target.value, validationMessage);
        });
        
        input.addEventListener('blur', (e) => {
            this.validateEmail(e.target.value, validationMessage, true);
        });
        
        input.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
    }
    
    validateEmail(email, messageElement, showOnBlur = false) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (email.length === 0) {
            messageElement.style.display = 'none';
            return;
        }
        
        if (showOnBlur || email.length > 3) {
            messageElement.style.display = 'block';
            messageElement.textContent = isValid ? '✓ Valid email' : '✗ Invalid email format';
            messageElement.className = `email-validation ${isValid ? 'valid' : 'invalid'}`;
        }
    }
    
    handleFocus(element) {
        element.classList.add('focused');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('email-input', `
            .vanilla-email-input {
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
            
            .vanilla-email-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .email-validation {
                margin-top: 0.5rem;
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
            }
            
            .email-validation.valid {
                color: var(--cosmic-accent);
                background: rgba(0, 255, 136, 0.1);
            }
            
            .email-validation.invalid {
                color: var(--cosmic-danger);
                background: rgba(255, 51, 102, 0.1);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('email-input-library', `
            .library-email-input {
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
            
            .library-email-input:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

/**
 * 🔍 Search Box Component
 */
class SearchBoxComponent extends BaseComponent {
    constructor() {
        super('Search Box', 'Advanced search with suggestions', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'search-box-container';
        
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'vanilla-search-input';
        input.placeholder = this.options.placeholder || 'Search...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.id = this.options.id;
        
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'search-button';
        searchBtn.innerHTML = '🔍';
        searchBtn.setAttribute('aria-label', 'Search');
        
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        suggestions.style.display = 'none';
        
        searchWrapper.appendChild(input);
        searchWrapper.appendChild(searchBtn);
        container.appendChild(searchWrapper);
        container.appendChild(suggestions);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'search-box-container';
        
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = `library-search-input ${libraryId}-search-input`;
        input.placeholder = this.options.placeholder || 'Search...';
        input.value = this.options.value || '';
        input.disabled = this.options.disabled;
        input.id = `${this.options.id}-library`;
        
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'search-button';
        searchBtn.innerHTML = '🔍';
        searchBtn.setAttribute('aria-label', 'Search');
        
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        suggestions.style.display = 'none';
        
        searchWrapper.appendChild(input);
        searchWrapper.appendChild(searchBtn);
        container.appendChild(searchWrapper);
        container.appendChild(suggestions);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const input = element.querySelector('.vanilla-search-input');
        const searchBtn = element.querySelector('.search-button');
        const suggestions = element.querySelector('.search-suggestions');
        
        // Mock suggestions data
        const mockSuggestions = [
            'Cosmic exploration',
            'Vanilla.js components',
            'UI/UX design',
            'Mobile optimization',
            'Web development',
            'JavaScript frameworks',
            'CSS animations',
            'Responsive design'
        ];
        
        input.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value, suggestions, mockSuggestions);
        });
        
        input.addEventListener('focus', () => {
            if (input.value.length > 0) {
                suggestions.style.display = 'block';
            }
        });
        
        input.addEventListener('blur', (e) => {
            // Delay hiding to allow clicking on suggestions
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200);
        });
        
        searchBtn.addEventListener('click', () => {
            this.performSearch(input.value);
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(input.value);
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const input = element.querySelector('.library-search-input');
        const searchBtn = element.querySelector('.search-button');
        const suggestions = element.querySelector('.search-suggestions');
        
        const mockSuggestions = [
            'Cosmic exploration',
            'Vanilla.js components',
            'UI/UX design',
            'Mobile optimization',
            'Web development',
            'JavaScript frameworks',
            'CSS animations',
            'Responsive design'
        ];
        
        input.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value, suggestions, mockSuggestions);
        });
        
        input.addEventListener('focus', () => {
            if (input.value.length > 0) {
                suggestions.style.display = 'block';
            }
        });
        
        input.addEventListener('blur', (e) => {
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200);
        });
        
        searchBtn.addEventListener('click', () => {
            this.performSearch(input.value);
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(input.value);
            }
        });
    }
    
    handleSearchInput(query, suggestions, mockSuggestions) {
        if (query.length === 0) {
            suggestions.style.display = 'none';
            return;
        }
        
        const filteredSuggestions = mockSuggestions.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredSuggestions.length > 0) {
            suggestions.innerHTML = filteredSuggestions
                .slice(0, 5)
                .map(item => `<div class="suggestion-item">${item}</div>`)
                .join('');
            
            suggestions.style.display = 'block';
            
            // Add click handlers to suggestions
            suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const input = suggestions.parentElement.querySelector('input');
                    input.value = item.textContent;
                    suggestions.style.display = 'none';
                    this.performSearch(item.textContent);
                });
            });
        } else {
            suggestions.style.display = 'none';
        }
    }
    
    performSearch(query) {
        console.log('Searching for:', query);
        // Implement actual search logic here
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('search-box', `
            .search-box-container {
                margin: 1rem 0;
            }
            
            .search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .vanilla-search-input {
                width: 100%;
                padding: 12px 50px 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .vanilla-search-input:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .search-button {
                position: absolute;
                right: 8px;
                background: var(--cosmic-primary);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
            }
            
            .search-button:hover {
                background: var(--cosmic-accent);
                transform: scale(1.05);
            }
            
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                margin-top: 4px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .suggestion-item {
                padding: 12px 16px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                cursor: pointer;
                transition: background 0.2s ease;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .suggestion-item:last-child {
                border-bottom: none;
            }
            
            .suggestion-item:hover {
                background: var(--cosmic-neutral);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('search-box-library', `
            .library-search-input {
                width: 100%;
                padding: 12px 50px 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .library-search-input:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

/**
 * 📝 Text Area Component
 */
class TextAreaComponent extends BaseComponent {
    constructor() {
        super('Text Area', 'Multi-line text input', 'classic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'text-area-container';
        
        const label = document.createElement('label');
        label.textContent = 'Message';
        label.htmlFor = this.options.id;
        label.className = 'input-label';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'vanilla-textarea';
        textarea.placeholder = this.options.placeholder || 'Enter your message...';
        textarea.value = this.options.value || '';
        textarea.disabled = this.options.disabled;
        textarea.required = this.options.required;
        textarea.id = this.options.id;
        textarea.rows = this.options.rows || 4;
        
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.textContent = `0 / ${this.options.maxLength || 500} characters`;
        
        container.appendChild(label);
        container.appendChild(textarea);
        container.appendChild(charCount);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'text-area-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Message`;
        label.htmlFor = `${this.options.id}-library`;
        label.className = 'input-label';
        
        const textarea = document.createElement('textarea');
        textarea.className = `library-textarea ${libraryId}-textarea`;
        textarea.placeholder = this.options.placeholder || 'Enter your message...';
        textarea.value = this.options.value || '';
        textarea.disabled = this.options.disabled;
        textarea.required = this.options.required;
        textarea.id = `${this.options.id}-library`;
        textarea.rows = this.options.rows || 4;
        
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.textContent = `0 / ${this.options.maxLength || 500} characters`;
        
        container.appendChild(label);
        container.appendChild(textarea);
        container.appendChild(charCount);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const textarea = element.querySelector('.vanilla-textarea');
        const charCount = element.querySelector('.char-count');
        const maxLength = this.options.maxLength || 500;
        
        textarea.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value, charCount, maxLength);
        });
        
        textarea.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        textarea.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const textarea = element.querySelector('.library-textarea');
        const charCount = element.querySelector('.char-count');
        const maxLength = this.options.maxLength || 500;
        
        textarea.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value, charCount, maxLength);
        });
        
        textarea.addEventListener('focus', (e) => {
            this.handleFocus(e.target);
        });
        
        textarea.addEventListener('blur', (e) => {
            this.handleBlur(e.target);
        });
    }
    
    updateCharCount(value, charCountElement, maxLength) {
        const currentLength = value.length;
        const remaining = maxLength - currentLength;
        
        charCountElement.textContent = `${currentLength} / ${maxLength} characters`;
        
        if (remaining < 50) {
            charCountElement.style.color = remaining < 10 ? 'var(--cosmic-danger)' : 'var(--cosmic-warning)';
        } else {
            charCountElement.style.color = 'var(--cosmic-neutral)';
        }
    }
    
    handleFocus(element) {
        element.classList.add('focused');
    }
    
    handleBlur(element) {
        element.classList.remove('focused');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('text-area', `
            .text-area-container {
                margin: 1rem 0;
            }
            
            .vanilla-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                line-height: 1.5;
                resize: vertical;
                min-height: 100px;
                transition: all 0.3s ease;
            }
            
            .vanilla-textarea:focus {
                outline: none;
                border-color: var(--cosmic-primary);
                box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
            }
            
            .char-count {
                margin-top: 0.5rem;
                text-align: right;
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                color: var(--cosmic-neutral);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('text-area-library', `
            .library-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1rem;
                line-height: 1.5;
                resize: vertical;
                min-height: 100px;
                transition: all 0.3s ease;
            }
            
            .library-textarea:focus {
                outline: none;
                border-color: var(--cosmic-secondary);
                box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PasswordInputComponent,
        EmailInputComponent,
        SearchBoxComponent,
        TextAreaComponent
    };
}
