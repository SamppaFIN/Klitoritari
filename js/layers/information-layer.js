/**
 * InformationLayer - Handles HUD, notifications, and game info display
 * Manages game statistics, notifications, and informational overlays
 */

class InformationLayer extends BaseLayer {
    constructor() {
        super('information');
        this.zIndex = 7;
        
        // HUD elements
        this.hudElements = new Map();
        this.hudVisible = true;
        
        // Notifications
        this.notifications = [];
        this.maxNotifications = 5;
        this.notificationDuration = 3000; // ms
        
        // Game stats
        this.stats = {
            level: 1,
            experience: 0,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            resources: {
                cosmic: 0,
                eldritch: 0,
                void: 0
            },
            position: { x: 0, y: 0 },
            speed: 0,
            direction: 0
        };
        
        // UI styling
        this.styles = {
            hud: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#666',
                textColor: '#fff',
                accentColor: '#ff6b6b',
                font: '14px Arial'
            },
            notification: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: '#ff6b6b',
                textColor: '#fff',
                font: '12px Arial'
            }
        };
        
        // Event listeners
        this.boundStatsUpdate = this.handleStatsUpdate.bind(this);
        this.boundNotificationAdd = this.handleNotificationAdd.bind(this);
        this.boundHUDToggle = this.handleHUDToggle.bind(this);
    }

    init() {
        console.log('🎨 InformationLayer: Initializing...');
        
        // Initialize HUD elements
        this.initializeHUDElements();
        
        // Listen for events
        this.eventBus.on('stats:update', this.boundStatsUpdate);
        this.eventBus.on('notification:add', this.boundNotificationAdd);
        this.eventBus.on('hud:toggle', this.boundHUDToggle);
        
        console.log('🎨 InformationLayer: Initialized');
    }

    destroy() {
        console.log('🎨 InformationLayer: Destroying...');
        
        // Remove event listeners
        this.eventBus.off('stats:update', this.boundStatsUpdate);
        this.eventBus.off('notification:add', this.boundNotificationAdd);
        this.eventBus.off('hud:toggle', this.boundHUDToggle);
        
        console.log('🎨 InformationLayer: Destroyed');
    }

    doRender(deltaTime) {
        if (!this.ctx) return;
        
        // Update notifications
        this.updateNotifications(deltaTime);
        
        // Render HUD
        if (this.hudVisible) {
            this.renderHUD();
        }
        
        // Render notifications
        this.renderNotifications();
    }

    // Event Handlers
    handleStatsUpdate(data) {
        this.stats = { ...this.stats, ...data };
        console.log('🎨 InformationLayer: Stats updated', data);
    }

    handleNotificationAdd(data) {
        const notification = {
            id: Date.now() + Math.random(),
            text: data.text,
            type: data.type || 'info',
            duration: data.duration || this.notificationDuration,
            startTime: Date.now(),
            visible: true
        };
        
        this.notifications.push(notification);
        
        // Limit notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(-this.maxNotifications);
        }
        
        console.log('🎨 InformationLayer: Notification added', notification);
    }

    handleHUDToggle(data) {
        this.hudVisible = data.visible !== undefined ? data.visible : !this.hudVisible;
        console.log('🎨 InformationLayer: HUD toggled', this.hudVisible);
    }

    // HUD Management
    initializeHUDElements() {
        // Health bar
        this.addHUDElement('health', {
            x: 20,
            y: 20,
            width: 200,
            height: 20,
            type: 'bar',
            label: 'Health',
            value: this.stats.health,
            maxValue: this.stats.maxHealth,
            color: '#ff6b6b'
        });
        
        // Energy bar
        this.addHUDElement('energy', {
            x: 20,
            y: 50,
            width: 200,
            height: 20,
            type: 'bar',
            label: 'Energy',
            value: this.stats.energy,
            maxValue: this.stats.maxEnergy,
            color: '#4ecdc4'
        });
        
        // Level display
        this.addHUDElement('level', {
            x: 20,
            y: 80,
            width: 100,
            height: 30,
            type: 'text',
            label: 'Level',
            value: this.stats.level,
            color: '#ffd93d'
        });
        
        // Resources display
        this.addHUDElement('resources', {
            x: 20,
            y: 120,
            width: 200,
            height: 60,
            type: 'resources',
            values: this.stats.resources
        });
        
        // Position display
        this.addHUDElement('position', {
            x: this.canvas.width - 150,
            y: 20,
            width: 130,
            height: 40,
            type: 'text',
            label: 'Position',
            value: `${Math.round(this.stats.position.x)}, ${Math.round(this.stats.position.y)}`,
            color: '#fff'
        });
    }

    addHUDElement(id, config) {
        const element = {
            id,
            ...config,
            visible: true
        };
        
        this.hudElements.set(id, element);
        console.log(`🎨 InformationLayer: Added HUD element "${id}"`);
    }

    removeHUDElement(id) {
        this.hudElements.delete(id);
        console.log(`🎨 InformationLayer: Removed HUD element "${id}"`);
    }

    updateHUDElement(id, updates) {
        const element = this.hudElements.get(id);
        if (element) {
            Object.assign(element, updates);
        }
    }

    // Notification Management
    updateNotifications(deltaTime) {
        const now = Date.now();
        
        this.notifications = this.notifications.filter(notification => {
            const elapsed = now - notification.startTime;
            return elapsed < notification.duration;
        });
    }

    addNotification(text, type = 'info', duration = this.notificationDuration) {
        this.handleNotificationAdd({ text, type, duration });
    }

    clearNotifications() {
        this.notifications = [];
    }

    // Rendering Methods
    renderHUD() {
        for (const [id, element] of this.hudElements) {
            if (!element.visible) continue;
            
            this.renderHUDElement(element);
        }
    }

    renderHUDElement(element) {
        this.ctx.save();
        
        switch (element.type) {
            case 'bar':
                this.renderBarElement(element);
                break;
            case 'text':
                this.renderTextElement(element);
                break;
            case 'resources':
                this.renderResourcesElement(element);
                break;
            default:
                this.renderGenericElement(element);
        }
        
        this.ctx.restore();
    }

    renderBarElement(element) {
        const { x, y, width, height, label, value, maxValue, color } = element;
        
        // Background
        this.ctx.fillStyle = this.styles.hud.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.hud.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Fill bar
        const fillWidth = (value / maxValue) * (width - 4);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 2, y + 2, fillWidth, height - 4);
        
        // Label
        this.ctx.fillStyle = this.styles.hud.textColor;
        this.ctx.font = this.styles.hud.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(label, x, y - 15);
        
        // Value text
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${value}/${maxValue}`, x + width, y - 15);
    }

    renderTextElement(element) {
        const { x, y, width, height, label, value, color } = element;
        
        // Background
        this.ctx.fillStyle = this.styles.hud.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.hud.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Label
        this.ctx.fillStyle = this.styles.hud.textColor;
        this.ctx.font = this.styles.hud.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(label, x + 5, y + 5);
        
        // Value
        this.ctx.fillStyle = color || this.styles.hud.accentColor;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(value.toString(), x + width / 2, y + height / 2 + 5);
    }

    renderResourcesElement(element) {
        const { x, y, width, height, values } = element;
        
        // Background
        this.ctx.fillStyle = this.styles.hud.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.hud.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Resources
        const resources = [
            { name: 'Cosmic', value: values.cosmic, color: '#ffd93d' },
            { name: 'Eldritch', value: values.eldritch, color: '#ff6b6b' },
            { name: 'Void', value: values.void, color: '#4ecdc4' }
        ];
        
        resources.forEach((resource, index) => {
            const itemY = y + 10 + (index * 18);
            
            // Resource name
            this.ctx.fillStyle = this.styles.hud.textColor;
            this.ctx.font = this.styles.hud.font;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(resource.name, x + 5, itemY);
            
            // Resource value
            this.ctx.fillStyle = resource.color;
            this.ctx.textAlign = 'right';
            this.ctx.fillText(resource.value.toString(), x + width - 5, itemY);
        });
    }

    renderGenericElement(element) {
        const { x, y, width, height, label } = element;
        
        // Background
        this.ctx.fillStyle = this.styles.hud.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.hud.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Label
        if (label) {
            this.ctx.fillStyle = this.styles.hud.textColor;
            this.ctx.font = this.styles.hud.font;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label, x + width / 2, y + height / 2);
        }
    }

    renderNotifications() {
        const startY = 100;
        const spacing = 60;
        
        this.notifications.forEach((notification, index) => {
            const y = startY + (index * spacing);
            this.renderNotification(notification, y);
        });
    }

    renderNotification(notification, y) {
        const { text, type } = notification;
        const x = this.canvas.width - 300;
        const width = 280;
        const height = 50;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.notification.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border based on type
        let borderColor = this.styles.notification.borderColor;
        switch (type) {
            case 'error':
                borderColor = '#ff6b6b';
                break;
            case 'warning':
                borderColor = '#ffd93d';
                break;
            case 'success':
                borderColor = '#4ecdc4';
                break;
        }
        
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Text
        this.ctx.fillStyle = this.styles.notification.textColor;
        this.ctx.font = this.styles.notification.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + 10, y + height / 2);
        
        this.ctx.restore();
    }

    // Public Methods
    updateStats(stats) {
        this.handleStatsUpdate(stats);
    }

    showNotification(text, type = 'info', duration = this.notificationDuration) {
        this.addNotification(text, type, duration);
    }

    toggleHUD() {
        this.handleHUDToggle({});
    }

    setHUDVisible(visible) {
        this.handleHUDToggle({ visible });
    }
}

// Make available globally
window.InformationLayer = InformationLayer;
