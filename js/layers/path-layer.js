/**
 * PathLayer - Player movement trails and paths
 * 
 * This layer handles:
 * - Player movement trails
 * - Path visualization
 * - Trail effects and animations
 * - Path markers and waypoints
 * 
 * Z-Index: 3 (above territory)
 */

class PathLayer extends BaseLayer {
    constructor() {
        super('path');
        this.zIndex = 3;
        this.paths = new Map();
        this.trails = new Map();
        this.waypoints = new Map();
        this.pathEffects = new Map();
        this.trailFadeTime = 5000; // 5 seconds
        this.pathColors = {
            player: '#3b82f6',
            npc: '#8b5cf6',
            quest: '#f59e0b',
            exploration: '#10b981'
        };
        this.animationPhase = 0;
    }

    init() {
        super.init();
        console.log('🛤️ PathLayer: Initializing path system...');
        
        // Initialize path data
        this.initializePaths();
        
        // Set up animation
        this.startAnimation();
        
        console.log('🛤️ PathLayer: Path system initialized');
    }

    initializePaths() {
        // Load existing paths from game state
        this.loadPathsFromGameState();
        
        // Create initial path markers if none exist
        this.createInitialPathMarkers();
    }
    
    createInitialPathMarkers() {
        console.log('🛤️ PathLayer: Creating initial path markers...');
        
        // Create a default player path if none exists
        if (!this.paths.has('player')) {
            const playerPath = {
                id: 'player',
                type: 'player',
                points: [],
                color: this.pathColors.player,
                width: 3,
                opacity: 0.8,
                animated: true
            };
            this.paths.set('player', playerPath);
            console.log('🛤️ PathLayer: Created default player path');
        }
        
        // Create initial waypoints
        this.createInitialWaypoints();
        
        console.log('🛤️ PathLayer: Initial path markers created');
    }
    
    createInitialWaypoints() {
        // Add some initial waypoints around the center
        const centerX = this.canvas ? this.canvas.width / 2 : 400;
        const centerY = this.canvas ? this.canvas.height / 2 : 300;
        
        const waypoints = [
            { id: 'start', x: centerX, y: centerY, type: 'start', label: 'Start Point' },
            { id: 'north', x: centerX, y: centerY - 100, type: 'waypoint', label: 'North' },
            { id: 'east', x: centerX + 100, y: centerY, type: 'waypoint', label: 'East' },
            { id: 'south', x: centerX, y: centerY + 100, type: 'waypoint', label: 'South' },
            { id: 'west', x: centerX - 100, y: centerY, type: 'waypoint', label: 'West' }
        ];
        
        waypoints.forEach(waypoint => {
            this.waypoints.set(waypoint.id, waypoint);
        });
        
        console.log('🛤️ PathLayer: Created initial waypoints:', waypoints.length);
    }

    loadPathsFromGameState() {
        if (this.gameState) {
            const paths = this.gameState.get('paths');
            if (paths && paths.forEach) {
                paths.forEach((path, id) => {
                    this.addPath(id, path);
                });
            }
        }
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.isVisible) {
                this.animationId = requestAnimationFrame(animate);
                return;
            }

            this.animationPhase += 0.02;
            if (this.animationPhase > Math.PI * 2) {
                this.animationPhase = 0;
            }

            // Update trail fade
            this.updateTrailFade(timestamp);

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updateTrailFade(timestamp) {
        this.trails.forEach((trail, id) => {
            if (trail.points.length > 0) {
                const age = timestamp - trail.lastUpdate;
                if (age > this.trailFadeTime) {
                    // Remove oldest points
                    trail.points = trail.points.filter(point => 
                        timestamp - point.timestamp < this.trailFadeTime
                    );
                }
            }
        });
    }

    doRender(deltaTime) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render paths
        this.renderPaths();

        // Render trails
        this.renderTrails();

        // Render waypoints
        this.renderWaypoints();

        // Render path effects
        this.renderPathEffects();
    }

    renderPaths() {
        this.paths.forEach((path, id) => {
            this.renderPath(path);
        });
    }

    renderPath(path) {
        const { points, color, width, type } = path;
        
        if (!points || points.length < 2) return;

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width || 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Convert GPS points to screen coordinates
        const screenPoints = points.map(point => {
            const screenPos = this.gpsToScreen(point.lat, point.lng);
            return screenPos ? { x: screenPos.x, y: screenPos.y, timestamp: point.timestamp } : null;
        }).filter(point => point !== null);

        if (screenPoints.length < 2) {
            this.ctx.restore();
            return;
        }

        // Draw path
        this.ctx.beginPath();
        this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
        
        for (let i = 1; i < screenPoints.length; i++) {
            this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
        }
        
        this.ctx.stroke();

        // Add path effects based on type
        switch (type) {
            case 'quest':
                this.renderQuestPathEffects(screenPoints);
                break;
            case 'exploration':
                this.renderExplorationPathEffects(screenPoints);
                break;
        }

        this.ctx.restore();
    }

    renderQuestPathEffects(screenPoints) {
        // Add quest-specific effects
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
        
        for (let i = 1; i < screenPoints.length; i++) {
            this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    renderExplorationPathEffects(screenPoints) {
        // Add exploration-specific effects
        this.ctx.fillStyle = '#10b981';
        this.ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < screenPoints.length; i += 10) {
            const point = screenPoints[i];
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }

    renderTrails() {
        this.trails.forEach((trail, id) => {
            this.renderTrail(trail);
        });
    }

    renderTrail(trail) {
        const { points, color, width } = trail;
        
        if (!points || points.length < 2) return;

        this.ctx.save();

        // Convert GPS points to screen coordinates
        const screenPoints = points.map(point => {
            const screenPos = this.gpsToScreen(point.lat, point.lng);
            return screenPos ? { x: screenPos.x, y: screenPos.y, timestamp: point.timestamp } : null;
        }).filter(point => point !== null);

        if (screenPoints.length < 2) {
            this.ctx.restore();
            return;
        }

        // Draw trail with fade effect
        for (let i = 0; i < screenPoints.length - 1; i++) {
            const point = screenPoints[i];
            const nextPoint = screenPoints[i + 1];
            const age = Date.now() - point.timestamp;
            const opacity = Math.max(0, 1 - (age / this.trailFadeTime));

            this.ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            this.ctx.lineWidth = width || 2;
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(nextPoint.x, nextPoint.y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    renderWaypoints() {
        this.waypoints.forEach((waypoint, id) => {
            this.renderWaypoint(waypoint);
        });
    }

    renderWaypoint(waypoint) {
        const { x, y, type, label } = waypoint;
        
        if (x === undefined || y === undefined) return;

        this.ctx.save();

        // Set waypoint colors based on type
        let color = '#3b82f6'; // Default blue
        let size = 12;
        
        switch (type) {
            case 'start':
                color = '#10b981'; // Green
                size = 15;
                break;
            case 'waypoint':
                color = '#f59e0b'; // Orange
                size = 10;
                break;
            case 'quest':
                color = '#8b5cf6'; // Purple
                size = 12;
                break;
            case 'exploration':
                color = '#ef4444'; // Red
                size = 10;
                break;
        }

        // Draw waypoint glow
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw waypoint circle
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw waypoint icon
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${size * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        let icon = '📍';
        if (type === 'start') icon = '🏁';
        else if (type === 'quest') icon = '❓';
        else if (type === 'exploration') icon = '🔍';
        
        this.ctx.fillText(icon, x, y);

        // Draw label if provided
        if (label) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(label, x, y + size + 5);
        }

        this.ctx.restore();
    }

    renderQuestWaypointEffect(screenPos) {
        // Pulsing effect for quest waypoints
        const pulseRadius = 15 + Math.sin(this.animationPhase * 2) * 5;
        const opacity = 0.3 + Math.sin(this.animationPhase * 2) * 0.2;

        this.ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, pulseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    renderExplorationWaypointEffect(screenPos) {
        // Rotating effect for exploration waypoints
        const rotation = this.animationPhase * 2;
        const radius = 12;

        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + rotation;
            const x = screenPos.x + Math.cos(angle) * radius;
            const y = screenPos.y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
    }

    renderPathEffects() {
        this.pathEffects.forEach((effect, id) => {
            this.renderPathEffect(effect);
        });
    }

    renderPathEffect(effect) {
        const { position, type, phase } = effect;
        
        if (!position) return;

        // Convert GPS to screen coordinates
        const screenPos = this.gpsToScreen(position.lat, position.lng);
        if (!screenPos) return;

        this.ctx.save();

        switch (type) {
            case 'sparkle':
                this.renderSparkleEffect(screenPos, phase);
                break;
            case 'glow':
                this.renderGlowEffect(screenPos, phase);
                break;
        }

        this.ctx.restore();
    }

    renderSparkleEffect(screenPos, phase) {
        const sparkleCount = 5;
        const radius = 20;

        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i / sparkleCount) * Math.PI * 2 + phase;
            const x = screenPos.x + Math.cos(angle) * radius;
            const y = screenPos.y + Math.sin(angle) * radius;
            const size = 2 + Math.sin(phase * 3 + i) * 1;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(phase * 2 + i) * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    renderGlowEffect(screenPos, phase) {
        const radius = 15 + Math.sin(phase * 2) * 5;
        const opacity = 0.3 + Math.sin(phase * 2) * 0.2;

        this.ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Public methods for external control
    addPath(id, path) {
        const pathData = {
            id,
            points: path.points || [],
            color: path.color || this.pathColors.player,
            width: path.width || 3,
            type: path.type || 'player',
            visible: path.visible !== false
        };

        this.paths.set(id, pathData);
        console.log('🛤️ PathLayer: Added path', id);
    }

    removePath(id) {
        this.paths.delete(id);
        console.log('🛤️ PathLayer: Removed path', id);
    }

    updatePath(id, updates) {
        const path = this.paths.get(id);
        if (path) {
            Object.assign(path, updates);
            console.log('🛤️ PathLayer: Updated path', id);
        }
    }

    addTrail(id, trail) {
        const trailData = {
            id,
            points: trail.points || [],
            color: trail.color || this.pathColors.player,
            width: trail.width || 2,
            lastUpdate: Date.now()
        };

        this.trails.set(id, trailData);
        console.log('🛤️ PathLayer: Added trail', id);
    }

    removeTrail(id) {
        this.trails.delete(id);
        console.log('🛤️ PathLayer: Removed trail', id);
    }

    addWaypoint(id, waypoint) {
        const waypointData = {
            id,
            position: waypoint.position,
            type: waypoint.type || 'exploration',
            color: waypoint.color || this.pathColors.exploration,
            size: waypoint.size || 8,
            visible: waypoint.visible !== false
        };

        this.waypoints.set(id, waypointData);
        console.log('🛤️ PathLayer: Added waypoint', id);
    }

    removeWaypoint(id) {
        this.waypoints.delete(id);
        console.log('🛤️ PathLayer: Removed waypoint', id);
    }

    addPathEffect(id, effect) {
        const pathEffect = {
            id,
            position: effect.position,
            type: effect.type || 'sparkle',
            phase: 0,
            duration: effect.duration || 2000
        };

        this.pathEffects.set(id, pathEffect);
        console.log('🛤️ PathLayer: Added path effect', id);
    }

    removePathEffect(id) {
        this.pathEffects.delete(id);
        console.log('🛤️ PathLayer: Removed path effect', id);
    }

    setTrailFadeTime(time) {
        this.trailFadeTime = time;
    }

    setPathColor(type, color) {
        this.pathColors[type] = color;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        super.destroy();
        console.log('🛤️ PathLayer: Destroyed');
    }
}

// Make globally available
window.PathLayer = PathLayer;
