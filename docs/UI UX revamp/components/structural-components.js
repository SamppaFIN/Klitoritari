/**
 * 🏗️ Structural Components
 * Advanced structural UI components implemented in vanilla.js vs libraries
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🃏 Card Component
 */
class CardComponent extends BaseComponent {
    constructor() {
        super('Card', 'Content container with hover effects', 'structural');
    }
    
    createVanillaElement() {
        const card = document.createElement('div');
        card.className = 'vanilla-card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Cosmic Card</h3>
                <div class="card-actions">
                    <button class="card-action-btn">⋮</button>
                </div>
            </div>
            <div class="card-content">
                <p class="card-description">This is a beautiful cosmic card with advanced hover effects and smooth animations.</p>
                <div class="card-image">
                    <div class="placeholder-image">🌟</div>
                </div>
            </div>
            <div class="card-footer">
                <button class="card-btn primary">Explore</button>
                <button class="card-btn secondary">Learn More</button>
            </div>
        `;
        
        return card;
    }
    
    createLibraryElement(libraryId) {
        const card = document.createElement('div');
        card.className = `library-card ${libraryId}-card`;
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${libraryId.toUpperCase()} Card</h3>
                <div class="card-actions">
                    <button class="card-action-btn">⋮</button>
                </div>
            </div>
            <div class="card-content">
                <p class="card-description">This is a ${libraryId} card implementation with similar functionality.</p>
                <div class="card-image">
                    <div class="placeholder-image">${this.getLibraryIcon(libraryId)}</div>
                </div>
            </div>
            <div class="card-footer">
                <button class="card-btn primary">Explore</button>
                <button class="card-btn secondary">Learn More</button>
            </div>
        `;
        
        return card;
    }
    
    getLibraryIcon(libraryId) {
        const icons = {
            'react': '⚛️',
            'vue': '💚',
            'angular': '🅰️',
            'svelte': '🧡',
            'lit': '⚡'
        };
        return icons[libraryId] || '🌟';
    }
    
    setupVanillaEventListeners(element) {
        const card = element.querySelector('.vanilla-card');
        const actionBtn = element.querySelector('.card-action-btn');
        const cardBtns = element.querySelectorAll('.card-btn');
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            this.handleCardHover(card, true);
        });
        
        card.addEventListener('mouseleave', () => {
            this.handleCardHover(card, false);
        });
        
        // Action button
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleActionClick();
        });
        
        // Card buttons
        cardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleButtonClick(btn.textContent);
            });
        });
        
        // Card click
        card.addEventListener('click', () => {
            this.handleCardClick();
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const card = element.querySelector('.library-card');
        const actionBtn = element.querySelector('.card-action-btn');
        const cardBtns = element.querySelectorAll('.card-btn');
        
        // Similar event listeners for library version
        card.addEventListener('mouseenter', () => {
            this.handleCardHover(card, true);
        });
        
        card.addEventListener('mouseleave', () => {
            this.handleCardHover(card, false);
        });
        
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleActionClick();
        });
        
        cardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleButtonClick(btn.textContent);
            });
        });
        
        card.addEventListener('click', () => {
            this.handleCardClick();
        });
    }
    
    handleCardHover(card, isHovering) {
        if (isHovering) {
            card.classList.add('hovered');
            this.createHoverEffect(card);
        } else {
            card.classList.remove('hovered');
        }
    }
    
    createHoverEffect(card) {
        const effect = document.createElement('div');
        effect.className = 'hover-effect';
        effect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                rgba(74, 158, 255, 0.1), 
                rgba(138, 43, 226, 0.1), 
                rgba(0, 255, 136, 0.1)
            );
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        card.appendChild(effect);
        
        requestAnimationFrame(() => {
            effect.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            effect.style.opacity = '0';
            setTimeout(() => effect.remove(), 300);
        }, { once: true });
    }
    
    handleActionClick() {
        console.log('Card action clicked');
        this.showActionMenu();
    }
    
    handleButtonClick(buttonText) {
        console.log('Card button clicked:', buttonText);
    }
    
    handleCardClick() {
        console.log('Card clicked');
    }
    
    showActionMenu() {
        // Create action menu
        const menu = document.createElement('div');
        menu.className = 'card-action-menu';
        menu.innerHTML = `
            <div class="menu-item">Edit</div>
            <div class="menu-item">Share</div>
            <div class="menu-item">Delete</div>
        `;
        
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--cosmic-darker);
            border: 1px solid var(--cosmic-neutral);
            border-radius: 8px;
            padding: 0.5rem 0;
            min-width: 120px;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        const card = document.querySelector('.vanilla-card, .library-card');
        card.style.position = 'relative';
        card.appendChild(menu);
        
        // Remove menu after 3 seconds
        setTimeout(() => {
            menu.remove();
        }, 3000);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('card', `
            .vanilla-card {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .vanilla-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 
                    0 20px 40px rgba(74, 158, 255, 0.2),
                    0 0 0 1px rgba(74, 158, 255, 0.1);
                border-color: var(--cosmic-primary);
            }
            
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .card-title {
                font-family: var(--font-primary);
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--cosmic-light);
                margin: 0;
            }
            
            .card-actions {
                position: relative;
            }
            
            .card-action-btn {
                background: none;
                border: none;
                color: var(--cosmic-neutral);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .card-action-btn:hover {
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
            }
            
            .card-content {
                margin-bottom: 1.5rem;
            }
            
            .card-description {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .card-image {
                width: 100%;
                height: 120px;
                background: var(--cosmic-dark);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--cosmic-neutral);
            }
            
            .placeholder-image {
                font-size: 3rem;
                opacity: 0.6;
            }
            
            .card-footer {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
            }
            
            .card-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .card-btn.primary {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .card-btn.primary:hover {
                background: var(--cosmic-accent);
                transform: translateY(-1px);
            }
            
            .card-btn.secondary {
                background: transparent;
                color: var(--cosmic-neutral);
                border: 1px solid var(--cosmic-neutral);
            }
            
            .card-btn.secondary:hover {
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
            }
            
            .card-action-menu {
                animation: slideDown 0.2s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .menu-item {
                padding: 0.75rem 1rem;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .menu-item:hover {
                background: var(--cosmic-neutral);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('card-library', `
            .library-card {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            
            .library-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 
                    0 20px 40px rgba(138, 43, 226, 0.2),
                    0 0 0 1px rgba(138, 43, 226, 0.1);
                border-color: var(--cosmic-secondary);
            }
        `);
    }
}

/**
 * 🗂️ Modal Component
 */
class ModalComponent extends BaseComponent {
    constructor() {
        super('Modal', 'Overlay dialog system', 'structural');
    }
    
    createVanillaElement() {
        const modal = document.createElement('div');
        modal.className = 'vanilla-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Cosmic Modal</h2>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p>This is a beautiful cosmic modal with smooth animations and backdrop blur effects.</p>
                    <div class="modal-form">
                        <input type="text" placeholder="Enter your name..." class="modal-input">
                        <textarea placeholder="Your message..." class="modal-textarea"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary">Cancel</button>
                    <button class="modal-btn primary">Save</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    createLibraryElement(libraryId) {
        const modal = document.createElement('div');
        modal.className = `library-modal ${libraryId}-modal`;
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${libraryId.toUpperCase()} Modal</h2>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p>This is a ${libraryId} modal implementation with similar functionality.</p>
                    <div class="modal-form">
                        <input type="text" placeholder="Enter your name..." class="modal-input">
                        <textarea placeholder="Your message..." class="modal-textarea"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary">Cancel</button>
                    <button class="modal-btn primary">Save</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    setupVanillaEventListeners(element) {
        const modal = element.querySelector('.vanilla-modal');
        const closeBtn = element.querySelector('.modal-close');
        const backdrop = element.querySelector('.modal-backdrop');
        const cancelBtn = element.querySelector('.modal-btn.secondary');
        const saveBtn = element.querySelector('.modal-btn.primary');
        
        // Close modal
        const closeModal = () => {
            this.closeModal(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Save action
        saveBtn.addEventListener('click', () => {
            this.handleSave();
            closeModal();
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Show modal
        this.showModal(modal);
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const modal = element.querySelector('.library-modal');
        const closeBtn = element.querySelector('.modal-close');
        const backdrop = element.querySelector('.modal-backdrop');
        const cancelBtn = element.querySelector('.modal-btn.secondary');
        const saveBtn = element.querySelector('.modal-btn.primary');
        
        const closeModal = () => {
            this.closeModal(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            this.handleSave();
            closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        this.showModal(modal);
    }
    
    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-content');
            content.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    closeModal(modal) {
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'translate(-50%, -50%) scale(0.9)';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            modal.remove();
        }, 300);
    }
    
    handleSave() {
        console.log('Modal save clicked');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('modal', `
            .vanilla-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .vanilla-modal.active {
                opacity: 1;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                cursor: pointer;
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 12px;
                min-width: 400px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transition: transform 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .modal-title {
                font-family: var(--font-primary);
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--cosmic-light);
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: var(--cosmic-neutral);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
            }
            
            .modal-body {
                padding: 1.5rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .modal-body p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .modal-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .modal-input,
            .modal-textarea {
                padding: 0.75rem;
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                background: var(--cosmic-dark);
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                transition: border-color 0.2s ease;
            }
            
            .modal-input:focus,
            .modal-textarea:focus {
                outline: none;
                border-color: var(--cosmic-primary);
            }
            
            .modal-textarea {
                min-height: 100px;
                resize: vertical;
            }
            
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                padding: 1.5rem;
                border-top: 1px solid var(--cosmic-neutral);
            }
            
            .modal-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .modal-btn.primary {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .modal-btn.primary:hover {
                background: var(--cosmic-accent);
            }
            
            .modal-btn.secondary {
                background: transparent;
                color: var(--cosmic-neutral);
                border: 1px solid var(--cosmic-neutral);
            }
            
            .modal-btn.secondary:hover {
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('modal-library', `
            .library-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .library-modal.active {
                opacity: 1;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                cursor: pointer;
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 12px;
                min-width: 400px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                transition: transform 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CardComponent,
        ModalComponent
    };
}
