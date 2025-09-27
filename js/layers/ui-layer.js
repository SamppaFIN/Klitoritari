/**
 * UILayer - Handles menus, dialogs, and interface elements
 * Manages game menus, modal dialogs, and interactive UI components
 */

class UILayer extends BaseLayer {
    constructor() {
        super('ui');
        this.zIndex = 8;
        
        // UI state
        this.activeMenu = null;
        this.modals = [];
        this.dialogs = [];
        this.tooltips = [];
        
        // Menu system
        this.menus = new Map();
        this.menuStack = [];
        
        // Dialog system
        this.dialogQueue = [];
        this.currentDialog = null;
        
        // UI styling
        this.styles = {
            menu: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: '#666',
                textColor: '#fff',
                accentColor: '#ff6b6b',
                font: '14px Arial',
                titleFont: '18px Arial'
            },
            dialog: {
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: '#ff6b6b',
                textColor: '#fff',
                font: '14px Arial',
                titleFont: '20px Arial'
            },
            button: {
                backgroundColor: '#666',
                hoverColor: '#888',
                activeColor: '#444',
                borderColor: '#999',
                textColor: '#fff',
                font: '14px Arial'
            }
        };
        
        // Event listeners
        this.boundMenuOpen = this.handleMenuOpen.bind(this);
        this.boundMenuClose = this.handleMenuClose.bind(this);
        this.boundDialogShow = this.handleDialogShow.bind(this);
        this.boundDialogHide = this.handleDialogHide.bind(this);
        this.boundUIElementClick = this.handleUIElementClick.bind(this);
    }

    init() {
        console.log('🎨 UILayer: Initializing...');
        
        // Initialize default menus
        this.initializeMenus();
        
        // Listen for events
        this.eventBus.on('ui:menu:open', this.boundMenuOpen);
        this.eventBus.on('ui:menu:close', this.boundMenuClose);
        this.eventBus.on('ui:dialog:show', this.boundDialogShow);
        this.eventBus.on('ui:dialog:hide', this.boundDialogHide);
        this.eventBus.on('ui:element:click', this.boundUIElementClick);
        
        console.log('🎨 UILayer: Initialized');
    }

    destroy() {
        console.log('🎨 UILayer: Destroying...');
        
        // Remove event listeners
        this.eventBus.off('ui:menu:open', this.boundMenuOpen);
        this.eventBus.off('ui:menu:close', this.boundMenuClose);
        this.eventBus.off('ui:dialog:show', this.boundDialogShow);
        this.eventBus.off('ui:dialog:hide', this.boundDialogHide);
        this.eventBus.off('ui:element:click', this.boundUIElementClick);
        
        console.log('🎨 UILayer: Destroyed');
    }

    doRender(deltaTime) {
        if (!this.ctx) return;
        
        // Render active menu
        if (this.activeMenu) {
            this.renderMenu(this.activeMenu);
        }
        
        // Render modals
        this.modals.forEach(modal => this.renderModal(modal));
        
        // Render dialogs
        this.dialogs.forEach(dialog => this.renderDialog(dialog));
        
        // Render tooltips
        this.tooltips.forEach(tooltip => this.renderTooltip(tooltip));
    }

    // Event Handlers
    handleMenuOpen(data) {
        const { menuId, options = {} } = data;
        this.openMenu(menuId, options);
    }

    handleMenuClose(data) {
        const { menuId } = data;
        this.closeMenu(menuId);
    }

    handleDialogShow(data) {
        const { dialogId, content, options = {} } = data;
        this.showDialog(dialogId, content, options);
    }

    handleDialogHide(data) {
        const { dialogId } = data;
        this.hideDialog(dialogId);
    }

    handleUIElementClick(data) {
        const { element } = data;
        
        // Handle menu item clicks
        if (element.menuId) {
            this.handleMenuItemClick(element);
        }
        
        // Handle dialog button clicks
        if (element.dialogId) {
            this.handleDialogButtonClick(element);
        }
    }

    // Menu Management
    initializeMenus() {
        // Main menu
        this.addMenu('main', {
            title: 'Eldritch Sanctuary',
            items: [
                { id: 'resume', text: 'Resume Game', action: 'resume' },
                { id: 'settings', text: 'Settings', action: 'openMenu', target: 'settings' },
                { id: 'inventory', text: 'Inventory', action: 'openMenu', target: 'inventory' },
                { id: 'quests', text: 'Quests', action: 'openMenu', target: 'quests' },
                { id: 'exit', text: 'Exit Game', action: 'exit' }
            ],
            x: this.canvas.width / 2 - 150,
            y: this.canvas.height / 2 - 150,
            width: 300,
            height: 300
        });
        
        // Settings menu
        this.addMenu('settings', {
            title: 'Settings',
            items: [
                { id: 'audio', text: 'Audio Settings', action: 'openDialog', target: 'audioSettings' },
                { id: 'graphics', text: 'Graphics Settings', action: 'openDialog', target: 'graphicsSettings' },
                { id: 'controls', text: 'Control Settings', action: 'openDialog', target: 'controlSettings' },
                { id: 'back', text: 'Back', action: 'closeMenu', target: 'settings' }
            ],
            x: this.canvas.width / 2 - 150,
            y: this.canvas.height / 2 - 150,
            width: 300,
            height: 300
        });
        
        // Inventory menu
        this.addMenu('inventory', {
            title: 'Inventory',
            items: [
                { id: 'items', text: 'Items', action: 'openDialog', target: 'inventoryItems' },
                { id: 'equipment', text: 'Equipment', action: 'openDialog', target: 'equipment' },
                { id: 'back', text: 'Back', action: 'closeMenu', target: 'inventory' }
            ],
            x: this.canvas.width / 2 - 150,
            y: this.canvas.height / 2 - 150,
            width: 300,
            height: 300
        });
        
        // Quests menu
        this.addMenu('quests', {
            title: 'Quests',
            items: [
                { id: 'active', text: 'Active Quests', action: 'openDialog', target: 'activeQuests' },
                { id: 'completed', text: 'Completed Quests', action: 'openDialog', target: 'completedQuests' },
                { id: 'back', text: 'Back', action: 'closeMenu', target: 'quests' }
            ],
            x: this.canvas.width / 2 - 150,
            y: this.canvas.height / 2 - 150,
            width: 300,
            height: 300
        });
    }

    addMenu(id, config) {
        const menu = {
            id,
            ...config,
            visible: false,
            items: config.items || []
        };
        
        this.menus.set(id, menu);
        console.log(`🎨 UILayer: Added menu "${id}"`);
    }

    openMenu(menuId, options = {}) {
        const menu = this.menus.get(menuId);
        if (!menu) {
            console.error(`🎨 UILayer: Menu "${menuId}" not found`);
            return;
        }
        
        // Close current menu
        if (this.activeMenu) {
            this.closeMenu(this.activeMenu.id);
        }
        
        // Open new menu
        menu.visible = true;
        this.activeMenu = menu;
        this.menuStack.push(menuId);
        
        console.log(`🎨 UILayer: Opened menu "${menuId}"`);
    }

    closeMenu(menuId) {
        if (this.activeMenu && this.activeMenu.id === menuId) {
            this.activeMenu.visible = false;
            this.activeMenu = null;
            this.menuStack.pop();
            
            // Open previous menu if available
            if (this.menuStack.length > 0) {
                const previousMenuId = this.menuStack[this.menuStack.length - 1];
                this.openMenu(previousMenuId);
            }
        }
        
        console.log(`🎨 UILayer: Closed menu "${menuId}"`);
    }

    // Dialog Management
    showDialog(dialogId, content, options = {}) {
        const dialog = {
            id: dialogId,
            content,
            options,
            visible: true,
            x: options.x || this.canvas.width / 2 - 200,
            y: options.y || this.canvas.height / 2 - 150,
            width: options.width || 400,
            height: options.height || 300
        };
        
        this.dialogs.push(dialog);
        console.log(`🎨 UILayer: Showed dialog "${dialogId}"`);
    }

    hideDialog(dialogId) {
        this.dialogs = this.dialogs.filter(dialog => dialog.id !== dialogId);
        console.log(`🎨 UILayer: Hid dialog "${dialogId}"`);
    }

    // Rendering Methods
    renderMenu(menu) {
        if (!menu.visible) return;
        
        this.ctx.save();
        
        // Menu background
        this.ctx.fillStyle = this.styles.menu.backgroundColor;
        this.ctx.fillRect(menu.x, menu.y, menu.width, menu.height);
        
        // Menu border
        this.ctx.strokeStyle = this.styles.menu.borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(menu.x, menu.y, menu.width, menu.height);
        
        // Menu title
        this.ctx.fillStyle = this.styles.menu.accentColor;
        this.ctx.font = this.styles.menu.titleFont;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(menu.title, menu.x + menu.width / 2, menu.y + 20);
        
        // Menu items
        menu.items.forEach((item, index) => {
            this.renderMenuItem(menu, item, index);
        });
        
        this.ctx.restore();
    }

    renderMenuItem(menu, item, index) {
        const itemY = menu.y + 60 + (index * 40);
        const itemHeight = 35;
        
        // Item background
        this.ctx.fillStyle = this.styles.button.backgroundColor;
        this.ctx.fillRect(menu.x + 20, itemY, menu.width - 40, itemHeight);
        
        // Item border
        this.ctx.strokeStyle = this.styles.button.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(menu.x + 20, itemY, menu.width - 40, itemHeight);
        
        // Item text
        this.ctx.fillStyle = this.styles.button.textColor;
        this.ctx.font = this.styles.button.font;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(item.text, menu.x + menu.width / 2, itemY + itemHeight / 2);
    }

    renderModal(modal) {
        // Modal implementation
        this.ctx.save();
        
        // Modal background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Modal content
        this.ctx.fillStyle = this.styles.dialog.backgroundColor;
        this.ctx.fillRect(modal.x, modal.y, modal.width, modal.height);
        
        this.ctx.restore();
    }

    renderDialog(dialog) {
        if (!dialog.visible) return;
        
        this.ctx.save();
        
        // Dialog background
        this.ctx.fillStyle = this.styles.dialog.backgroundColor;
        this.ctx.fillRect(dialog.x, dialog.y, dialog.width, dialog.height);
        
        // Dialog border
        this.ctx.strokeStyle = this.styles.dialog.borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(dialog.x, dialog.y, dialog.width, dialog.height);
        
        // Dialog content
        this.ctx.fillStyle = this.styles.dialog.textColor;
        this.ctx.font = this.styles.dialog.font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Wrap text
        const lines = this.wrapText(dialog.content.text || '', dialog.width - 40);
        lines.forEach((line, index) => {
            this.ctx.fillText(line, dialog.x + 20, dialog.y + 40 + (index * 20));
        });
        
        // Dialog buttons
        if (dialog.content.buttons) {
            dialog.content.buttons.forEach((button, index) => {
                this.renderDialogButton(dialog, button, index);
            });
        }
        
        this.ctx.restore();
    }

    renderDialogButton(dialog, button, index) {
        const buttonY = dialog.y + dialog.height - 60;
        const buttonWidth = 80;
        const buttonHeight = 30;
        const buttonSpacing = 10;
        const totalWidth = (buttonWidth + buttonSpacing) * dialog.content.buttons.length - buttonSpacing;
        const startX = dialog.x + (dialog.width - totalWidth) / 2;
        const buttonX = startX + index * (buttonWidth + buttonSpacing);
        
        // Button background
        this.ctx.fillStyle = this.styles.button.backgroundColor;
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button border
        this.ctx.strokeStyle = this.styles.button.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button text
        this.ctx.fillStyle = this.styles.button.textColor;
        this.ctx.font = this.styles.button.font;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(button.text, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }

    renderTooltip(tooltip) {
        // Tooltip implementation
        this.ctx.save();
        
        // Tooltip background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(tooltip.x, tooltip.y, tooltip.width, tooltip.height);
        
        // Tooltip text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(tooltip.text, tooltip.x + 5, tooltip.y + 5);
        
        this.ctx.restore();
    }

    // Utility Methods
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    // Event Handlers
    handleMenuItemClick(element) {
        const { action, target } = element;
        
        switch (action) {
            case 'resume':
                this.closeMenu('main');
                break;
            case 'openMenu':
                this.openMenu(target);
                break;
            case 'closeMenu':
                this.closeMenu(target);
                break;
            case 'openDialog':
                this.showDialog(target, { text: `Dialog for ${target}` });
                break;
            case 'exit':
                this.eventBus.emit('game:exit');
                break;
        }
    }

    handleDialogButtonClick(element) {
        const { action, target } = element;
        
        switch (action) {
            case 'close':
                this.hideDialog(target);
                break;
            case 'confirm':
                this.eventBus.emit('dialog:confirm', { dialogId: target });
                this.hideDialog(target);
                break;
            case 'cancel':
                this.eventBus.emit('dialog:cancel', { dialogId: target });
                this.hideDialog(target);
                break;
        }
    }

    // Public Methods
    openMainMenu() {
        this.openMenu('main');
    }

    closeAllMenus() {
        this.activeMenu = null;
        this.menuStack = [];
    }

    showConfirmationDialog(title, message, onConfirm, onCancel) {
        this.showDialog('confirmation', {
            title,
            text: message,
            buttons: [
                { text: 'Cancel', action: 'cancel', target: 'confirmation' },
                { text: 'Confirm', action: 'confirm', target: 'confirmation' }
            ]
        });
    }
}

// Make available globally
window.UILayer = UILayer;
