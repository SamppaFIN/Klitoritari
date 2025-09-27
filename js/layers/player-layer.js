/**
 * PlayerLayer - Handles player avatar and movement visualization
 * Manages player position, movement trails, and avatar rendering
 */

class PlayerLayer extends BaseLayer {
    constructor() {
        super('player');
        this.zIndex = 6;
        
        // Player state
        this.playerPosition = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        this.isMoving = false;
        this.movementSpeed = 2; // pixels per frame
        
        // Avatar properties
        this.avatarSize = 20;
        this.avatarColor = '#ff6b6b';
        this.avatarBorderColor = '#fff';
        this.avatarGlowColor = '#ff6b6b';
        
        // Movement trail
        this.trailPoints = [];
        this.maxTrailLength = 50;
        this.trailFadeTime = 2000; // ms
        
        // Animation
        this.animationTime = 0;
        this.pulseScale = 1.0;
        this.pulseSpeed = 0.05;
        
        // Event listeners
        this.boundPositionUpdate = this.handlePositionUpdate.bind(this);
        this.boundMovementStart = this.handleMovementStart.bind(this);
        this.boundMovementEnd = this.handleMovementEnd.bind(this);
    }

    init() {
        console.log('🎨 PlayerLayer: Initializing...');
        
        // Set initial position from game state or use center of canvas
        if (this.gameState && this.gameState.player) {
            this.playerPosition = { 
                x: this.gameState.player.x || this.canvas.width / 2, 
                y: this.gameState.player.y || this.canvas.height / 2 
            };
        } else {
            // Default to center of canvas
            this.playerPosition = { 
                x: this.canvas.width / 2, 
                y: this.canvas.height / 2 
            };
        }
        this.targetPosition = { ...this.playerPosition };
        
        console.log('🎨 PlayerLayer: Initial position set to:', this.playerPosition);
        
        // Listen for position updates
        this.eventBus.on('player:position:update', this.boundPositionUpdate);
        this.eventBus.on('player:movement:start', this.boundMovementStart);
        this.eventBus.on('player:movement:end', this.boundMovementEnd);
        
        console.log('🎨 PlayerLayer: Initialized');
    }

    destroy() {
        console.log('🎨 PlayerLayer: Destroying...');
        
        // Remove event listeners
        this.eventBus.off('player:position:update', this.boundPositionUpdate);
        this.eventBus.off('player:movement:start', this.boundMovementStart);
        this.eventBus.off('player:movement:end', this.boundMovementEnd);
        
        console.log('🎨 PlayerLayer: Destroyed');
    }

    doRender(deltaTime) {
        if (!this.ctx) return;
        
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Render movement trail
        this.renderMovementTrail();
        
        // Render player avatar
        this.renderPlayerAvatar();
        
        // Render movement indicators
        this.renderMovementIndicators();
    }

    // Event Handlers
    handlePositionUpdate(data) {
        const { x, y, immediate = false } = data;
        
        if (immediate) {
            this.playerPosition = { x, y };
            this.targetPosition = { x, y };
            this.isMoving = false;
        } else {
            this.targetPosition = { x, y };
            this.isMoving = true;
        }
        
        // Add to trail
        this.addTrailPoint(this.playerPosition.x, this.playerPosition.y);
    }

    handleMovementStart(data) {
        this.isMoving = true;
        console.log('🎨 PlayerLayer: Movement started');
    }

    handleMovementEnd(data) {
        this.isMoving = false;
        console.log('🎨 PlayerLayer: Movement ended');
    }

    // Animation and Movement
    updateAnimation(deltaTime) {
        this.animationTime += deltaTime;
        
        // Pulse animation
        this.pulseScale = 1.0 + Math.sin(this.animationTime * this.pulseSpeed) * 0.1;
    }

    updateMovement(deltaTime) {
        if (!this.isMoving) return;
        
        const dx = this.targetPosition.x - this.playerPosition.x;
        const dy = this.targetPosition.y - this.playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 1) {
            // Close enough, snap to target
            this.playerPosition = { ...this.targetPosition };
            this.isMoving = false;
            this.eventBus.emit('player:movement:complete', { 
                x: this.playerPosition.x, 
                y: this.playerPosition.y 
            });
        } else {
            // Move towards target
            const moveDistance = this.movementSpeed * (deltaTime / 16.67); // Normalize to 60fps
            const moveX = (dx / distance) * moveDistance;
            const moveY = (dy / distance) * moveDistance;
            
            this.playerPosition.x += moveX;
            this.playerPosition.y += moveY;
            
            // Add to trail
            this.addTrailPoint(this.playerPosition.x, this.playerPosition.y);
        }
    }

    addTrailPoint(x, y) {
        const now = Date.now();
        this.trailPoints.push({ x, y, time: now });
        
        // Remove old trail points
        this.trailPoints = this.trailPoints.filter(point => 
            now - point.time < this.trailFadeTime
        );
        
        // Limit trail length
        if (this.trailPoints.length > this.maxTrailLength) {
            this.trailPoints = this.trailPoints.slice(-this.maxTrailLength);
        }
    }

    // Rendering Methods
    renderMovementTrail() {
        if (this.trailPoints.length < 2) return;
        
        this.ctx.save();
        
        // Create gradient for trail
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 107, 107, 0.0)');
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Draw trail
        this.ctx.beginPath();
        for (let i = 0; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i];
            const alpha = 1 - (Date.now() - point.time) / this.trailFadeTime;
            
            if (i === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        }
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    renderPlayerAvatar() {
        const { x, y } = this.playerPosition;
        
        this.ctx.save();
        
        // Apply pulse animation
        this.ctx.translate(x, y);
        this.ctx.scale(this.pulseScale, this.pulseScale);
        this.ctx.translate(-x, -y);
        
        // Draw outer glow effect
        this.ctx.shadowColor = this.avatarGlowColor;
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = this.avatarGlowColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.avatarSize + 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw inner glow
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.avatarSize + 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw main avatar circle
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = this.avatarColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.avatarSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = this.avatarBorderColor;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw player icon (simple person symbol)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${this.avatarSize * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('👤', x, y);
        
        // Draw direction indicator if moving
        if (this.isMoving) {
            this.renderDirectionIndicator(x, y);
        }
        
        this.ctx.restore();
    }

    renderDirectionIndicator(x, y) {
        const dx = this.targetPosition.x - this.playerPosition.x;
        const dy = this.targetPosition.y - this.playerPosition.y;
        const angle = Math.atan2(dy, dx);
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        // Draw arrow
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(this.avatarSize + 5, 0);
        this.ctx.lineTo(this.avatarSize + 15, -5);
        this.ctx.lineTo(this.avatarSize + 15, 5);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    renderMovementIndicators() {
        if (!this.isMoving) return;
        
        const { x, y } = this.targetPosition;
        
        // Draw target indicator
        this.ctx.save();
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw pulsing ring
        const pulse = Math.sin(this.animationTime * 0.01) * 0.5 + 0.5;
        this.ctx.globalAlpha = pulse * 0.5;
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20 + pulse * 10, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    // Public Methods
    setPosition(x, y, immediate = false) {
        this.handlePositionUpdate({ x, y, immediate });
    }

    getPosition() {
        return { ...this.playerPosition };
    }

    isPlayerMoving() {
        return this.isMoving;
    }

    getTrailPoints() {
        return [...this.trailPoints];
    }

    clearTrail() {
        this.trailPoints = [];
    }

    setAvatarStyle(color, borderColor, glowColor) {
        this.avatarColor = color;
        this.avatarBorderColor = borderColor;
        this.avatarGlowColor = glowColor;
    }

    setMovementSpeed(speed) {
        this.movementSpeed = speed;
    }
}

// Make available globally
window.PlayerLayer = PlayerLayer;
