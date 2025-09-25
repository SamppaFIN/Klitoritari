/**
 * 🌟 AURORA COMPONENTS
 * Example components demonstrating the Aurora UI Library structure
 * 
 * These components show how to build consistent, well-documented UI components
 * that future Aurora instances can easily understand and use.
 */

/**
 * 🎯 AURORA BUTTON COMPONENT
 * A versatile button component with cosmic styling and advanced interactions
 */
class AuroraButton extends AuroraBaseComponent {
    constructor(options = {}) {
        super(options);
        
        this.metadata = {
            name: 'AuroraButton',
            version: '1.0.0',
            category: 'Form Controls',
            difficulty: 'Beginner',
            features: [
                'Multiple variants (primary, secondary, ghost, cosmic)',
                'Size options (small, medium, large)',
                'Icon support with positioning',
                'Loading states and animations',
                'Disabled states',
                'Keyboard navigation',
                'Accessibility features'
            ],
            accessibility: true,
            mobile: true,
            performance: 'optimized'
        };
        
        this.ariaLabel = options.ariaLabel || options.text || 'Button';
        this.role = 'button';
        this.keyboardNavigation = true;
        this.focusable = true;
        this.touchFriendly = true;
    }
    
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            text: 'Button',
            variant: 'primary', // primary, secondary, ghost, cosmic
            size: 'medium', // small, medium, large
            icon: null,
            iconPosition: 'left', // left, right
            loading: false,
            disabled: false,
            onClick: null,
            href: null, // Makes it a link button
            target: null,
            type: 'button', // button, submit, reset
            className: '',
            style: {},
            attributes: {}
        };
    }
    
    render() {
        const button = this.options.href ? document.createElement('a') : document.createElement('button');
        
        // Set base classes
        button.className = `aurora-button aurora-button--${this.options.variant} aurora-button--${this.options.size}`;
        
        if (this.options.className) {
            button.className += ` ${this.options.className}`;
        }
        
        if (this.options.loading) {
            button.classList.add('aurora-button--loading');
        }
        
        if (this.options.disabled) {
            button.classList.add('aurora-button--disabled');
        }
        
        // Set attributes
        if (this.options.id) {
            button.id = this.options.id;
        }
        
        if (this.options.href) {
            button.href = this.options.href;
            if (this.options.target) {
                button.target = this.options.target;
            }
        } else {
            button.type = this.options.type;
        }
        
        if (this.options.disabled) {
            button.disabled = true;
        }
        
        // Set custom attributes
        Object.entries(this.options.attributes).forEach(([key, value]) => {
            button.setAttribute(key, value);
        });
        
        // Set custom styles
        Object.entries(this.options.style).forEach(([key, value]) => {
            button.style[key] = value;
        });
        
        // Create content
        const content = document.createElement('span');
        content.className = 'aurora-button__content';
        
        // Add icon if provided
        if (this.options.icon) {
            const icon = document.createElement('span');
            icon.className = 'aurora-button__icon';
            icon.innerHTML = this.options.icon;
            
            if (this.options.iconPosition === 'left') {
                content.appendChild(icon);
            }
        }
        
        // Add text
        const text = document.createElement('span');
        text.className = 'aurora-button__text';
        text.textContent = this.options.text;
        content.appendChild(text);
        
        // Add icon after text if right positioned
        if (this.options.icon && this.options.iconPosition === 'right') {
            const icon = document.createElement('span');
            icon.className = 'aurora-button__icon';
            icon.innerHTML = this.options.icon;
            content.appendChild(icon);
        }
        
        // Add loading spinner if loading
        if (this.options.loading) {
            const spinner = document.createElement('span');
            spinner.className = 'aurora-button__spinner';
            spinner.innerHTML = '⟳';
            content.appendChild(spinner);
        }
        
        button.appendChild(content);
        
        this.element = button;
        return button;
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.element) {
            this.element.addEventListener('click', (e) => {
                if (this.options.disabled || this.options.loading) {
                    e.preventDefault();
                    return;
                }
                
                if (this.options.onClick) {
                    this.options.onClick(e);
                }
                
                this.emit('click', e);
            });
            
            // Keyboard support
            this.element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.element.click();
                }
            });
        }
    }
    
    getExamples() {
        return [
            {
                title: 'Basic Button',
                code: `const button = new AuroraButton({
    text: 'Click me',
    variant: 'primary',
    onClick: () => console.log('Clicked!')
});`,
                description: 'A simple primary button with click handler'
            },
            {
                title: 'Cosmic Button with Icon',
                code: `const cosmicButton = new AuroraButton({
    text: 'Explore',
    variant: 'cosmic',
    icon: '🌟',
    size: 'large',
    onClick: () => console.log('Cosmic exploration!')
});`,
                description: 'A cosmic-themed button with icon and large size'
            },
            {
                title: 'Loading Button',
                code: `const loadingButton = new AuroraButton({
    text: 'Saving...',
    variant: 'primary',
    loading: true,
    disabled: true
});`,
                description: 'A button in loading state'
            },
            {
                title: 'Link Button',
                code: `const linkButton = new AuroraButton({
    text: 'Visit Site',
    href: 'https://example.com',
    target: '_blank',
    icon: '🔗',
    variant: 'secondary'
});`,
                description: 'A button that acts as a link'
            }
        ];
    }
}

/**
 * 🃏 AURORA CARD COMPONENT
 * A flexible card component for displaying content
 */
class AuroraCard extends AuroraBaseComponent {
    constructor(options = {}) {
        super(options);
        
        this.metadata = {
            name: 'AuroraCard',
            version: '1.0.0',
            category: 'Layout',
            difficulty: 'Beginner',
            features: [
                'Flexible content areas',
                'Header, body, and footer sections',
                'Multiple variants and styles',
                'Hover effects and animations',
                'Responsive design',
                'Accessibility features'
            ],
            accessibility: true,
            mobile: true,
            performance: 'optimized'
        };
        
        this.role = 'article';
    }
    
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            title: null,
            subtitle: null,
            content: null,
            footer: null,
            variant: 'default', // default, cosmic, holographic, glass
            size: 'medium', // small, medium, large
            hoverable: true,
            clickable: false,
            onClick: null,
            className: '',
            style: {},
            attributes: {}
        };
    }
    
    render() {
        const card = document.createElement('div');
        
        // Set base classes
        card.className = `aurora-card aurora-card--${this.options.variant} aurora-card--${this.options.size}`;
        
        if (this.options.className) {
            card.className += ` ${this.options.className}`;
        }
        
        if (this.options.hoverable) {
            card.classList.add('aurora-card--hoverable');
        }
        
        if (this.options.clickable) {
            card.classList.add('aurora-card--clickable');
        }
        
        // Set attributes
        if (this.options.id) {
            card.id = this.options.id;
        }
        
        // Set custom attributes
        Object.entries(this.options.attributes).forEach(([key, value]) => {
            card.setAttribute(key, value);
        });
        
        // Set custom styles
        Object.entries(this.options.style).forEach(([key, value]) => {
            card.style[key] = value;
        });
        
        // Create header if title or subtitle provided
        if (this.options.title || this.options.subtitle) {
            const header = document.createElement('div');
            header.className = 'aurora-card__header';
            
            if (this.options.title) {
                const title = document.createElement('h3');
                title.className = 'aurora-card__title';
                title.textContent = this.options.title;
                header.appendChild(title);
            }
            
            if (this.options.subtitle) {
                const subtitle = document.createElement('p');
                subtitle.className = 'aurora-card__subtitle';
                subtitle.textContent = this.options.subtitle;
                header.appendChild(subtitle);
            }
            
            card.appendChild(header);
        }
        
        // Create body
        const body = document.createElement('div');
        body.className = 'aurora-card__body';
        
        if (this.options.content) {
            if (typeof this.options.content === 'string') {
                body.innerHTML = this.options.content;
            } else if (this.options.content instanceof HTMLElement) {
                body.appendChild(this.options.content);
            }
        }
        
        card.appendChild(body);
        
        // Create footer if provided
        if (this.options.footer) {
            const footer = document.createElement('div');
            footer.className = 'aurora-card__footer';
            
            if (typeof this.options.footer === 'string') {
                footer.innerHTML = this.options.footer;
            } else if (this.options.footer instanceof HTMLElement) {
                footer.appendChild(this.options.footer);
            }
            
            card.appendChild(footer);
        }
        
        this.element = card;
        return card;
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.element && this.options.clickable) {
            this.element.addEventListener('click', (e) => {
                if (this.options.onClick) {
                    this.options.onClick(e);
                }
                this.emit('click', e);
            });
        }
    }
    
    getExamples() {
        return [
            {
                title: 'Basic Card',
                code: `const card = new AuroraCard({
    title: 'Card Title',
    content: 'This is the card content',
    variant: 'default'
});`,
                description: 'A simple card with title and content'
            },
            {
                title: 'Cosmic Card',
                code: `const cosmicCard = new AuroraCard({
    title: '🌟 Cosmic Card',
    subtitle: 'Explore the universe',
    content: '<p>Journey through the stars and discover new worlds.</p>',
    variant: 'cosmic',
    hoverable: true
});`,
                description: 'A cosmic-themed card with hover effects'
            },
            {
                title: 'Clickable Card',
                code: `const clickableCard = new AuroraCard({
    title: 'Click Me',
    content: 'This card is clickable',
    clickable: true,
    onClick: () => console.log('Card clicked!')
});`,
                description: 'A clickable card with event handler'
            }
        ];
    }
}

/**
 * 🎭 AURORA MODAL COMPONENT
 * A flexible modal component with backdrop and animations
 */
class AuroraModal extends AuroraBaseComponent {
    constructor(options = {}) {
        super(options);
        
        this.metadata = {
            name: 'AuroraModal',
            version: '1.0.0',
            category: 'Layout',
            difficulty: 'Intermediate',
            features: [
                'Backdrop with blur effects',
                'Smooth open/close animations',
                'Keyboard navigation (ESC to close)',
                'Focus management',
                'Multiple sizes and positions',
                'Customizable content',
                'Accessibility compliant'
            ],
            accessibility: true,
            mobile: true,
            performance: 'optimized'
        };
        
        this.role = 'dialog';
        this.keyboardNavigation = true;
        this.focusable = true;
        this.isOpen = false;
    }
    
    getDefaultOptions() {
        return {
            ...super.getDefaultOptions(),
            title: null,
            content: null,
            size: 'medium', // small, medium, large, fullscreen
            position: 'center', // center, top, bottom
            closable: true,
            backdrop: true,
            backdropClose: true,
            onClose: null,
            onOpen: null,
            className: '',
            style: {},
            attributes: {}
        };
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'aurora-modal';
        modal.setAttribute('aria-hidden', 'true');
        
        // Set custom attributes
        Object.entries(this.options.attributes).forEach(([key, value]) => {
            modal.setAttribute(key, value);
        });
        
        // Set custom styles
        Object.entries(this.options.style).forEach(([key, value]) => {
            modal.style[key] = value;
        }
        
        // Create backdrop
        if (this.options.backdrop) {
            const backdrop = document.createElement('div');
            backdrop.className = 'aurora-modal__backdrop';
            modal.appendChild(backdrop);
        }
        
        // Create modal content
        const content = document.createElement('div');
        content.className = `aurora-modal__content aurora-modal__content--${this.options.size} aurora-modal__content--${this.options.position}`;
        
        // Create header if title provided
        if (this.options.title) {
            const header = document.createElement('div');
            header.className = 'aurora-modal__header';
            
            const title = document.createElement('h2');
            title.className = 'aurora-modal__title';
            title.textContent = this.options.title;
            header.appendChild(title);
            
            if (this.options.closable) {
                const closeButton = document.createElement('button');
                closeButton.className = 'aurora-modal__close';
                closeButton.innerHTML = '×';
                closeButton.setAttribute('aria-label', 'Close modal');
                header.appendChild(closeButton);
            }
            
            content.appendChild(header);
        }
        
        // Create body
        const body = document.createElement('div');
        body.className = 'aurora-modal__body';
        
        if (this.options.content) {
            if (typeof this.options.content === 'string') {
                body.innerHTML = this.options.content;
            } else if (this.options.content instanceof HTMLElement) {
                body.appendChild(this.options.content);
            }
        }
        
        content.appendChild(body);
        modal.appendChild(content);
        
        this.element = modal;
        return modal;
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.element) {
            // Close button
            const closeButton = this.element.querySelector('.aurora-modal__close');
            if (closeButton) {
                closeButton.addEventListener('click', () => this.close());
            }
            
            // Backdrop close
            if (this.options.backdropClose) {
                const backdrop = this.element.querySelector('.aurora-modal__backdrop');
                if (backdrop) {
                    backdrop.addEventListener('click', () => this.close());
                }
            }
            
            // ESC key close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }
    
    /**
     * Open the modal
     */
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.element.setAttribute('aria-hidden', 'false');
        this.element.classList.add('aurora-modal--open');
        
        // Focus management
        const focusableElements = this.element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        if (this.options.onOpen) {
            this.options.onOpen();
        }
        
        this.emit('open', this);
    }
    
    /**
     * Close the modal
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.setAttribute('aria-hidden', 'true');
        this.element.classList.remove('aurora-modal--open');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        if (this.options.onClose) {
            this.options.onClose();
        }
        
        this.emit('close', this);
    }
    
    /**
     * Toggle modal open/close
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    getExamples() {
        return [
            {
                title: 'Basic Modal',
                code: `const modal = new AuroraModal({
    title: 'Hello World',
    content: 'This is a basic modal',
    size: 'medium'
});
modal.open();`,
                description: 'A simple modal with title and content'
            },
            {
                title: 'Cosmic Modal',
                code: `const cosmicModal = new AuroraModal({
    title: '🌟 Cosmic Explorer',
    content: '<p>Journey through the stars and discover new worlds.</p>',
    size: 'large',
    variant: 'cosmic',
    backdrop: true
});
cosmicModal.open();`,
                description: 'A cosmic-themed modal with backdrop'
            },
            {
                title: 'Fullscreen Modal',
                code: `const fullscreenModal = new AuroraModal({
    title: 'Fullscreen Experience',
    content: document.getElementById('fullscreen-content'),
    size: 'fullscreen',
    closable: true
});
fullscreenModal.open();`,
                description: 'A fullscreen modal for immersive experiences'
            }
        ];
    }
}

// Export components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuroraButton,
        AuroraCard,
        AuroraModal
    };
} else if (typeof window !== 'undefined') {
    window.AuroraButton = AuroraButton;
    window.AuroraCard = AuroraCard;
    window.AuroraModal = AuroraModal;
}
