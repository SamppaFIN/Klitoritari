/**
 * InteractionLayer - Handles user input and UI interactions
 * 
 * This layer handles:
 * - Touch and click event processing
 * - UI element interactions (buttons, forms, etc.)
 * - Gesture recognition (tap, drag, swipe)
 * - Input validation and feedback
 * 
 * Z-Index: 5 (above map, below UI)
 */

class InteractionLayer extends BaseLayer {
    constructor() {
        super('interaction');
        this.zIndex = 5;
        
        // Interaction state
        this.isInteracting = false;
        this.lastInteractionTime = 0;
        this.interactionCooldown = 100; // ms
        
        // Touch/click handling
        this.touchStartPos = null;
        this.touchCurrentPos = null;
        this.isDragging = false;
        this.dragThreshold = 10; // pixels
        
        // UI elements
        this.uiElements = new Map();
        this.hoveredElement = null;
        this.activeElement = null;
        
        // Event listeners
        this.boundTouchStart = this.handleTouchStart.bind(this);
        this.boundTouchMove = this.handleTouchMove.bind(this);
        this.boundTouchEnd = this.handleTouchEnd.bind(this);
        this.boundClick = this.handleClick.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
    }

    init() {
        console.log('🎨 STEP 5.9.1: InteractionLayer: Initializing...');
        
        // Add event listeners
        console.log('🎨 STEP 5.9.2: Adding event listeners...');
        this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: false });
        this.canvas.addEventListener('click', this.boundClick);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        console.log('🎨 STEP 5.9.3 ✓: Event listeners added');
        
        // Initialize UI elements
        console.log('🎨 STEP 5.9.4: Initializing UI elements...');
        this.initializeUIElements();
        console.log('🎨 STEP 5.9.5 ✓: UI elements initialized');
        
        console.log('🎨 STEP 5.9.6 ✓: InteractionLayer: Initialized');
    }

    destroy() {
        console.log('🎨 InteractionLayer: Destroying...');
        
        // Remove event listeners
        this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        this.canvas.removeEventListener('touchmove', this.boundTouchMove);
        this.canvas.removeEventListener('touchend', this.boundTouchEnd);
        this.canvas.removeEventListener('click', this.boundClick);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
        
        // Clear UI elements
        this.uiElements.clear();
        
        console.log('🎨 InteractionLayer: Destroyed');
    }

    doRender(deltaTime) {
        if (!this.ctx) return;
        
        // Render interaction feedback
        this.renderInteractionFeedback();
        
        // Render UI elements
        this.renderUIElements();
        
        // Render touch/click indicators
        this.renderTouchIndicators();
    }

    // Touch/Click Event Handlers
    handleTouchStart(event) {
        event.preventDefault();
        
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.touchStartPos = { x, y };
        this.touchCurrentPos = { x, y };
        this.isDragging = false;
        this.isInteracting = true;
        
        // Check for UI element interaction
        const element = this.getElementAtPosition(x, y);
        if (element) {
            this.activeElement = element;
            this.eventBus.emit('ui:element:start', { element, x, y });
        }
        
        this.eventBus.emit('interaction:touch:start', { x, y });
    }

    handleTouchMove(event) {
        event.preventDefault();
        
        if (!this.touchStartPos) return;
        
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.touchCurrentPos = { x, y };
        
        // Check if we're dragging
        const distance = Math.sqrt(
            Math.pow(x - this.touchStartPos.x, 2) + 
            Math.pow(y - this.touchStartPos.y, 2)
        );
        
        if (distance > this.dragThreshold && !this.isDragging) {
            this.isDragging = true;
            this.eventBus.emit('interaction:drag:start', { 
                startX: this.touchStartPos.x, 
                startY: this.touchStartPos.y,
                currentX: x,
                currentY: y
            });
        }
        
        if (this.isDragging) {
            this.eventBus.emit('interaction:drag:move', { 
                startX: this.touchStartPos.x, 
                startY: this.touchStartPos.y,
                currentX: x,
                currentY: y,
                deltaX: x - this.touchCurrentPos.x,
                deltaY: y - this.touchCurrentPos.y
            });
        }
        
        // Update hover state
        const element = this.getElementAtPosition(x, y);
        if (element !== this.hoveredElement) {
            if (this.hoveredElement) {
                this.eventBus.emit('ui:element:leave', { element: this.hoveredElement });
            }
            this.hoveredElement = element;
            if (element) {
                this.eventBus.emit('ui:element:enter', { element });
            }
        }
        
        this.eventBus.emit('interaction:touch:move', { x, y, isDragging: this.isDragging });
    }

    handleTouchEnd(event) {
        event.preventDefault();
        
        if (!this.touchStartPos) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.changedTouches[0].clientX - rect.left;
        const y = event.changedTouches[0].clientY - rect.top;
        
        // Handle tap (not drag)
        if (!this.isDragging) {
            const element = this.getElementAtPosition(x, y);
            if (element) {
                this.eventBus.emit('ui:element:click', { element, x, y });
            }
            this.eventBus.emit('interaction:tap', { x, y });
        } else {
            this.eventBus.emit('interaction:drag:end', { 
                startX: this.touchStartPos.x, 
                startY: this.touchStartPos.y,
                endX: x,
                endY: y
            });
        }
        
        // Clean up
        this.touchStartPos = null;
        this.touchCurrentPos = null;
        this.isDragging = false;
        this.isInteracting = false;
        this.activeElement = null;
        
        this.eventBus.emit('interaction:touch:end', { x, y });
    }

    handleClick(event) {
        console.log('🎨 InteractionLayer: Click detected at', event.clientX, event.clientY);
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        console.log('🎨 InteractionLayer: Canvas click at (' + x + ', ' + y + ')');
        console.log('🎨 InteractionLayer: Canvas size:', this.canvas.width, 'x', this.canvas.height);
        console.log('🎨 InteractionLayer: Canvas rect:', rect);
        
        const element = this.getElementAtPosition(x, y);
        console.log('🎨 InteractionLayer: Element at position:', element ? element.id : 'none');
        
        if (element) {
            console.log('🎨 InteractionLayer: Clicking element:', element.id);
            this.eventBus.emit('ui:element:click', { element, x, y });
            
            // Handle specific button clicks
            if (element.id === 'gps-button') {
                console.log('📍 GPS button clicked - emitting gps:request event');
                this.eventBus.emit('gps:request');
            } else if (element.id === 'menu-button') {
                console.log('☰ Menu button clicked - emitting ui:menu:toggle event');
                this.eventBus.emit('ui:menu:toggle');
            }
        } else {
            console.log('🎨 InteractionLayer: No element found at click position');
        }
        
        this.eventBus.emit('interaction:click', { x, y });
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Update hover state
        const element = this.getElementAtPosition(x, y);
        if (element !== this.hoveredElement) {
            if (this.hoveredElement) {
                this.eventBus.emit('ui:element:leave', { element: this.hoveredElement });
            }
            this.hoveredElement = element;
            if (element) {
                this.eventBus.emit('ui:element:enter', { element });
            }
        }
        
        // Disabled mouse movement logging to reduce clutter
        // this.eventBus.emit('interaction:mouse:move', { x, y });
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const element = this.getElementAtPosition(x, y);
        if (element) {
            this.activeElement = element;
            this.eventBus.emit('ui:element:start', { element, x, y });
        }
        
        this.eventBus.emit('interaction:mouse:down', { x, y });
    }

    handleMouseUp(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const element = this.getElementAtPosition(x, y);
        if (element) {
            this.eventBus.emit('ui:element:click', { element, x, y });
        }
        
        this.activeElement = null;
        this.eventBus.emit('interaction:mouse:up', { x, y });
    }

    // UI Element Management
    initializeUIElements() {
        console.log('🎨 InteractionLayer: Initializing UI elements...');
        
        // Add basic UI elements
        this.addUIElement('gps-button', {
            x: 20,
            y: 20,
            width: 120,
            height: 40,
            text: 'Allow GPS',
            style: 'button',
            visible: true
        });
        console.log('🎨 InteractionLayer: Added GPS button at (20, 20)');
        
        this.addUIElement('menu-button', {
            x: this.canvas.width - 60,
            y: 20,
            width: 40,
            height: 40,
            text: '☰',
            style: 'icon',
            visible: true
        });
        console.log('🎨 InteractionLayer: Added menu button at (' + (this.canvas.width - 60) + ', 20)');
        
        console.log('🎨 InteractionLayer: Total UI elements:', this.uiElements.size);
    }

    addUIElement(id, config) {
        const element = {
            id,
            ...config,
            hovered: false,
            active: false,
            onClick: null,
            onHover: null,
            onLeave: null
        };
        
        this.uiElements.set(id, element);
        console.log(`🎨 InteractionLayer: Added UI element "${id}"`);
    }

    removeUIElement(id) {
        this.uiElements.delete(id);
        console.log(`🎨 InteractionLayer: Removed UI element "${id}"`);
    }

    getElementAtPosition(x, y) {
        for (const [id, element] of this.uiElements) {
            if (!element.visible) continue;
            
            if (x >= element.x && x <= element.x + element.width &&
                y >= element.y && y <= element.y + element.height) {
                return element;
            }
        }
        return null;
    }

    // Rendering Methods
    renderInteractionFeedback() {
        if (!this.isInteracting) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.touchCurrentPos.x, this.touchCurrentPos.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderUIElements() {
        for (const [id, element] of this.uiElements) {
            if (!element.visible) continue;
            
            this.renderUIElement(element);
        }
    }

    renderUIElement(element) {
        this.ctx.save();
        
        // Set element state
        if (element.hovered) {
            this.ctx.globalAlpha = 0.8;
        } else {
            this.ctx.globalAlpha = 1.0;
        }
        
        // Render based on style
        switch (element.style) {
            case 'button':
                this.renderButton(element);
                break;
            case 'icon':
                this.renderIcon(element);
                break;
            default:
                this.renderGenericElement(element);
        }
        
        this.ctx.restore();
    }

    renderButton(element) {
        // Button background
        this.ctx.fillStyle = element.active ? '#444' : '#666';
        this.ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Button border
        this.ctx.strokeStyle = element.hovered ? '#fff' : '#999';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Button text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            element.text, 
            element.x + element.width / 2, 
            element.y + element.height / 2
        );
    }

    renderIcon(element) {
        // Icon background
        this.ctx.fillStyle = element.active ? '#444' : '#666';
        this.ctx.fillRect(element.x, element.y, element.width, element.height);
        
        // Icon border
        this.ctx.strokeStyle = element.hovered ? '#fff' : '#999';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(element.x, element.y, element.width, element.height);
        
        // Icon text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            element.text, 
            element.x + element.width / 2, 
            element.y + element.height / 2
        );
    }

    renderGenericElement(element) {
        // Generic element rendering
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(element.x, element.y, element.width, element.height);
        
        if (element.text) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(element.text, element.x + 5, element.y + 5);
        }
    }

    renderTouchIndicators() {
        if (!this.touchStartPos) return;
        
        // Render touch start indicator
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.touchStartPos.x, this.touchStartPos.y, 15, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
        
        // Render current touch position
        if (this.touchCurrentPos) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(this.touchCurrentPos.x, this.touchCurrentPos.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
}

// Make available globally
window.InteractionLayer = InteractionLayer;
