/**
 * 📱 Mobile Optimization Components
 * Advanced mobile touch interfaces with gesture recognition
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 👆 Touch Gesture Component
 */
class TouchGestureComponent extends BaseComponent {
    constructor() {
        super('Touch Gestures', 'Advanced touch gesture recognition and handling', 'mobile');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'touch-gesture-container';
        
        const label = document.createElement('label');
        label.textContent = 'Touch Gesture Recognition';
        label.className = 'gesture-label';
        
        const gestureArea = document.createElement('div');
        gestureArea.className = 'vanilla-gesture-area';
        gestureArea.innerHTML = `
            <div class="gesture-zone" id="gesture-zone">
                <div class="gesture-instructions">
                    <h4>Touch Gestures</h4>
                    <p>Try these gestures:</p>
                    <ul>
                        <li>👆 Single tap</li>
                        <li>👆👆 Double tap</li>
                        <li>👆👆👆 Triple tap</li>
                        <li>👆➡️ Swipe right</li>
                        <li>👆⬅️ Swipe left</li>
                        <li>👆⬆️ Swipe up</li>
                        <li>👆⬇️ Swipe down</li>
                        <li>🤏 Pinch to zoom</li>
                        <li>👆👆 Two finger tap</li>
                        <li>👆👆👆 Three finger tap</li>
                    </ul>
                </div>
                <div class="gesture-feedback">
                    <div class="gesture-status">Ready for gestures</div>
                    <div class="gesture-details"></div>
                </div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'gesture-controls';
        controls.innerHTML = `
            <button class="gesture-btn" data-action="clear">Clear</button>
            <button class="gesture-btn" data-action="reset">Reset</button>
            <button class="gesture-btn" data-action="demo">Demo</button>
        `;
        
        container.appendChild(label);
        container.appendChild(gestureArea);
        container.appendChild(controls);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'touch-gesture-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Touch Gestures`;
        label.className = 'gesture-label';
        
        const gestureArea = document.createElement('div');
        gestureArea.className = `library-gesture-area ${libraryId}-gesture-area`;
        gestureArea.innerHTML = `
            <div class="gesture-zone" id="gesture-zone-lib">
                <div class="gesture-instructions">
                    <h4>Touch Gestures</h4>
                    <p>Try these gestures:</p>
                    <ul>
                        <li>👆 Single tap</li>
                        <li>👆👆 Double tap</li>
                        <li>👆👆👆 Triple tap</li>
                        <li>👆➡️ Swipe right</li>
                        <li>👆⬅️ Swipe left</li>
                        <li>👆⬆️ Swipe up</li>
                        <li>👆⬇️ Swipe down</li>
                        <li>🤏 Pinch to zoom</li>
                        <li>👆👆 Two finger tap</li>
                        <li>👆👆👆 Three finger tap</li>
                    </ul>
                </div>
                <div class="gesture-feedback">
                    <div class="gesture-status">Ready for gestures</div>
                    <div class="gesture-details"></div>
                </div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'gesture-controls';
        controls.innerHTML = `
            <button class="gesture-btn" data-action="clear">Clear</button>
            <button class="gesture-btn" data-action="reset">Reset</button>
            <button class="gesture-btn" data-action="demo">Demo</button>
        `;
        
        container.appendChild(label);
        container.appendChild(gestureArea);
        container.appendChild(controls);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const gestureZone = element.querySelector('#gesture-zone');
        const status = element.querySelector('.gesture-status');
        const details = element.querySelector('.gesture-details');
        const controls = element.querySelectorAll('.gesture-btn');
        
        // Initialize gesture recognition
        this.initGestureRecognition(gestureZone, status, details);
        
        // Control handlers
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleControl(e.target.dataset.action, status, details);
            });
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const gestureZone = element.querySelector('#gesture-zone-lib');
        const status = element.querySelector('.gesture-status');
        const details = element.querySelector('.gesture-details');
        const controls = element.querySelectorAll('.gesture-btn');
        
        this.initGestureRecognition(gestureZone, status, details);
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleControl(e.target.dataset.action, status, details);
            });
        });
    }
    
    initGestureRecognition(zone, statusElement, detailsElement) {
        let touchStartTime = 0;
        let touchEndTime = 0;
        let touchCount = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let lastTouchTime = 0;
        let gestureHistory = [];
        
        // Touch start
        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartTime = Date.now();
            touchCount = e.touches.length;
            
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
            
            // Visual feedback
            zone.style.background = 'rgba(74, 158, 255, 0.1)';
            statusElement.textContent = `Touch started (${touchCount} finger${touchCount > 1 ? 's' : ''})`;
        });
        
        // Touch move
        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - touchStartX;
                const deltaY = currentY - touchStartY;
                
                statusElement.textContent = `Moving: Δx=${Math.round(deltaX)}, Δy=${Math.round(deltaY)}`;
            }
        });
        
        // Touch end
        zone.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            if (e.changedTouches.length === 1) {
                touchEndX = e.changedTouches[0].clientX;
                touchEndY = e.changedTouches[0].clientY;
            }
            
            // Reset visual feedback
            zone.style.background = '';
            
            // Detect gesture
            const gesture = this.detectGesture(
                touchStartX, touchStartY, touchEndX, touchEndY,
                touchDuration, touchCount, lastTouchTime
            );
            
            if (gesture) {
                this.handleGesture(gesture, statusElement, detailsElement, gestureHistory);
            }
            
            lastTouchTime = touchEndTime;
        });
        
        // Mouse events for desktop testing
        zone.addEventListener('mousedown', (e) => {
            touchStartTime = Date.now();
            touchCount = 1;
            touchStartX = e.clientX;
            touchStartY = e.clientY;
            zone.style.background = 'rgba(74, 158, 255, 0.1)';
            statusElement.textContent = 'Mouse down';
        });
        
        zone.addEventListener('mouseup', (e) => {
            touchEndTime = Date.now();
            touchEndX = e.clientX;
            touchEndY = e.clientY;
            const touchDuration = touchEndTime - touchStartTime;
            
            zone.style.background = '';
            
            const gesture = this.detectGesture(
                touchStartX, touchStartY, touchEndX, touchEndY,
                touchDuration, touchCount, lastTouchTime
            );
            
            if (gesture) {
                this.handleGesture(gesture, statusElement, detailsElement, gestureHistory);
            }
            
            lastTouchTime = touchEndTime;
        });
    }
    
    detectGesture(startX, startY, endX, endY, duration, fingerCount, lastTouchTime) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const timeSinceLastTouch = Date.now() - lastTouchTime;
        
        // Tap detection
        if (duration < 300 && distance < 50) {
            if (timeSinceLastTouch < 300) {
                return { type: 'double-tap', fingers: fingerCount, x: endX, y: endY };
            } else {
                return { type: 'single-tap', fingers: fingerCount, x: endX, y: endY };
            }
        }
        
        // Swipe detection
        if (duration < 500 && distance > 50) {
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            if (angle > -45 && angle < 45) {
                return { type: 'swipe-right', fingers: fingerCount, distance, angle };
            } else if (angle > 135 || angle < -135) {
                return { type: 'swipe-left', fingers: fingerCount, distance, angle };
            } else if (angle > 45 && angle < 135) {
                return { type: 'swipe-down', fingers: fingerCount, distance, angle };
            } else if (angle > -135 && angle < -45) {
                return { type: 'swipe-up', fingers: fingerCount, distance, angle };
            }
        }
        
        // Long press detection
        if (duration > 500 && distance < 30) {
            return { type: 'long-press', fingers: fingerCount, duration };
        }
        
        return null;
    }
    
    handleGesture(gesture, statusElement, detailsElement, history) {
        const gestureText = this.getGestureText(gesture);
        statusElement.textContent = `Detected: ${gestureText}`;
        detailsElement.innerHTML = this.getGestureDetails(gesture);
        
        // Add to history
        history.unshift({
            gesture: gestureText,
            timestamp: new Date().toLocaleTimeString(),
            details: gesture
        });
        
        // Keep only last 10 gestures
        if (history.length > 10) {
            history.pop();
        }
        
        // Update history display
        this.updateGestureHistory(detailsElement, history);
        
        // Visual feedback
        this.showGestureFeedback(gesture);
    }
    
    getGestureText(gesture) {
        const fingerText = gesture.fingers > 1 ? ` (${gesture.fingers} fingers)` : '';
        
        switch(gesture.type) {
            case 'single-tap': return `Single Tap${fingerText}`;
            case 'double-tap': return `Double Tap${fingerText}`;
            case 'swipe-right': return `Swipe Right${fingerText}`;
            case 'swipe-left': return `Swipe Left${fingerText}`;
            case 'swipe-up': return `Swipe Up${fingerText}`;
            case 'swipe-down': return `Swipe Down${fingerText}`;
            case 'long-press': return `Long Press${fingerText}`;
            default: return 'Unknown Gesture';
        }
    }
    
    getGestureDetails(gesture) {
        let details = `<strong>Type:</strong> ${gesture.type}<br>`;
        details += `<strong>Fingers:</strong> ${gesture.fingers}<br>`;
        
        if (gesture.distance) {
            details += `<strong>Distance:</strong> ${Math.round(gesture.distance)}px<br>`;
        }
        
        if (gesture.angle) {
            details += `<strong>Angle:</strong> ${Math.round(gesture.angle)}°<br>`;
        }
        
        if (gesture.duration) {
            details += `<strong>Duration:</strong> ${gesture.duration}ms<br>`;
        }
        
        return details;
    }
    
    updateGestureHistory(detailsElement, history) {
        const historyHtml = history.map((item, index) => `
            <div class="gesture-history-item">
                <span class="gesture-time">${item.timestamp}</span>
                <span class="gesture-name">${item.gesture}</span>
            </div>
        `).join('');
        
        detailsElement.innerHTML += `
            <div class="gesture-history">
                <h5>Recent Gestures:</h5>
                ${historyHtml}
            </div>
        `;
    }
    
    showGestureFeedback(gesture) {
        // Create temporary visual feedback
        const feedback = document.createElement('div');
        feedback.className = 'gesture-feedback-visual';
        feedback.style.cssText = `
            position: absolute;
            left: ${gesture.x || 0}px;
            top: ${gesture.y || 0}px;
            width: 20px;
            height: 20px;
            background: var(--cosmic-accent);
            border-radius: 50%;
            pointer-events: none;
            animation: gesturePulse 0.6s ease-out;
            z-index: 1000;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 600);
    }
    
    handleControl(action, statusElement, detailsElement) {
        switch(action) {
            case 'clear':
                detailsElement.innerHTML = '';
                statusElement.textContent = 'Ready for gestures';
                break;
            case 'reset':
                detailsElement.innerHTML = '';
                statusElement.textContent = 'Ready for gestures';
                break;
            case 'demo':
                this.runGestureDemo(statusElement, detailsElement);
                break;
        }
    }
    
    runGestureDemo(statusElement, detailsElement) {
        const demos = [
            { type: 'single-tap', fingers: 1, x: 100, y: 100 },
            { type: 'double-tap', fingers: 1, x: 150, y: 150 },
            { type: 'swipe-right', fingers: 1, distance: 100, angle: 0 },
            { type: 'swipe-up', fingers: 1, distance: 80, angle: -90 }
        ];
        
        let index = 0;
        const runDemo = () => {
            if (index < demos.length) {
                this.handleGesture(demos[index], statusElement, detailsElement, []);
                index++;
                setTimeout(runDemo, 1000);
            }
        };
        
        runDemo();
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('touch-gesture', `
            .touch-gesture-container {
                margin: 1rem 0;
            }
            
            .gesture-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-gesture-area {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .gesture-zone {
                background: var(--cosmic-darker);
                border: 2px dashed var(--cosmic-neutral);
                border-radius: 8px;
                padding: 2rem;
                min-height: 300px;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .gesture-zone:hover {
                border-color: var(--cosmic-primary);
            }
            
            .gesture-instructions {
                margin-bottom: 2rem;
            }
            
            .gesture-instructions h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .gesture-instructions p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                margin: 0 0 1rem 0;
            }
            
            .gesture-instructions ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.5rem;
            }
            
            .gesture-instructions li {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                padding: 0.5rem;
                background: var(--cosmic-neutral);
                border-radius: 4px;
                text-align: center;
            }
            
            .gesture-feedback {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: var(--cosmic-dark);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                min-width: 200px;
            }
            
            .gesture-status {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .gesture-details {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
            }
            
            .gesture-history {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--cosmic-neutral);
            }
            
            .gesture-history h5 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 0.5rem 0;
                font-size: 0.875rem;
            }
            
            .gesture-history-item {
                display: flex;
                justify-content: space-between;
                padding: 0.25rem 0;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .gesture-time {
                color: var(--cosmic-neutral);
                font-size: 0.75rem;
            }
            
            .gesture-name {
                color: var(--cosmic-light);
                font-size: 0.75rem;
            }
            
            .gesture-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .gesture-btn {
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
            
            .gesture-btn:hover {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            @keyframes gesturePulse {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('touch-gesture-library', `
            .library-gesture-area {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            }
        `);
    }
}

/**
 * 📱 Mobile Navigation Component
 */
class MobileNavigationComponent extends BaseComponent {
    constructor() {
        super('Mobile Navigation', 'Touch-optimized mobile navigation patterns', 'mobile');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'mobile-nav-container';
        
        const label = document.createElement('label');
        label.textContent = 'Mobile Navigation';
        label.className = 'nav-label';
        
        const navDemo = document.createElement('div');
        navDemo.className = 'vanilla-mobile-nav-demo';
        navDemo.innerHTML = `
            <div class="mobile-nav" id="mobile-nav">
                <div class="nav-header">
                    <button class="nav-toggle" id="nav-toggle">☰</button>
                    <div class="nav-title">Eldritch Sanctuary</div>
                    <button class="nav-search">🔍</button>
                </div>
                
                <div class="nav-overlay" id="nav-overlay"></div>
                <div class="nav-drawer" id="nav-drawer">
                    <div class="nav-drawer-header">
                        <div class="nav-drawer-title">Navigation</div>
                        <button class="nav-close" id="nav-close">✕</button>
                    </div>
                    <nav class="nav-menu">
                        <a href="#" class="nav-item active">🏠 Home</a>
                        <a href="#" class="nav-item">🌟 Components</a>
                        <a href="#" class="nav-item">🎨 Animations</a>
                        <a href="#" class="nav-item">📱 Mobile</a>
                        <a href="#" class="nav-item">⚡ Performance</a>
                        <a href="#" class="nav-item">📊 Data</a>
                        <a href="#" class="nav-item">🧪 Testing</a>
                        <a href="#" class="nav-item">📚 Docs</a>
                    </nav>
                </div>
            </div>
            
            <div class="nav-content">
                <h3>Mobile Navigation Demo</h3>
                <p>This demonstrates various mobile navigation patterns optimized for touch interfaces.</p>
                <div class="nav-features">
                    <div class="feature-item">
                        <span class="feature-icon">👆</span>
                        <span class="feature-text">Touch-optimized buttons (44px minimum)</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📱</span>
                        <span class="feature-text">Responsive drawer navigation</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">⚡</span>
                        <span class="feature-text">Smooth animations and transitions</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎯</span>
                        <span class="feature-text">Gesture-based interactions</span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(navDemo);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'mobile-nav-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Mobile Navigation`;
        label.className = 'nav-label';
        
        const navDemo = document.createElement('div');
        navDemo.className = `library-mobile-nav-demo ${libraryId}-mobile-nav-demo`;
        navDemo.innerHTML = `
            <div class="mobile-nav" id="mobile-nav-lib">
                <div class="nav-header">
                    <button class="nav-toggle" id="nav-toggle-lib">☰</button>
                    <div class="nav-title">Eldritch Sanctuary</div>
                    <button class="nav-search">🔍</button>
                </div>
                
                <div class="nav-overlay" id="nav-overlay-lib"></div>
                <div class="nav-drawer" id="nav-drawer-lib">
                    <div class="nav-drawer-header">
                        <div class="nav-drawer-title">Navigation</div>
                        <button class="nav-close" id="nav-close-lib">✕</button>
                    </div>
                    <nav class="nav-menu">
                        <a href="#" class="nav-item active">🏠 Home</a>
                        <a href="#" class="nav-item">🌟 Components</a>
                        <a href="#" class="nav-item">🎨 Animations</a>
                        <a href="#" class="nav-item">📱 Mobile</a>
                        <a href="#" class="nav-item">⚡ Performance</a>
                        <a href="#" class="nav-item">📊 Data</a>
                        <a href="#" class="nav-item">🧪 Testing</a>
                        <a href="#" class="nav-item">📚 Docs</a>
                    </nav>
                </div>
            </div>
            
            <div class="nav-content">
                <h3>Mobile Navigation Demo</h3>
                <p>This demonstrates various mobile navigation patterns optimized for touch interfaces.</p>
                <div class="nav-features">
                    <div class="feature-item">
                        <span class="feature-icon">👆</span>
                        <span class="feature-text">Touch-optimized buttons (44px minimum)</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📱</span>
                        <span class="feature-text">Responsive drawer navigation</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">⚡</span>
                        <span class="feature-text">Smooth animations and transitions</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎯</span>
                        <span class="feature-text">Gesture-based interactions</span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(navDemo);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const navToggle = element.querySelector('#nav-toggle');
        const navClose = element.querySelector('#nav-close');
        const navOverlay = element.querySelector('#nav-overlay');
        const navDrawer = element.querySelector('#nav-drawer');
        const navItems = element.querySelectorAll('.nav-item');
        
        // Toggle navigation
        navToggle.addEventListener('click', () => {
            this.openNavigation(navDrawer, navOverlay);
        });
        
        navClose.addEventListener('click', () => {
            this.closeNavigation(navDrawer, navOverlay);
        });
        
        navOverlay.addEventListener('click', () => {
            this.closeNavigation(navDrawer, navOverlay);
        });
        
        // Navigation item selection
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectNavItem(navItems, item);
                this.closeNavigation(navDrawer, navOverlay);
            });
        });
        
        // Touch gestures for drawer
        this.setupDrawerGestures(navDrawer, navOverlay);
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const navToggle = element.querySelector('#nav-toggle-lib');
        const navClose = element.querySelector('#nav-close-lib');
        const navOverlay = element.querySelector('#nav-overlay-lib');
        const navDrawer = element.querySelector('#nav-drawer-lib');
        const navItems = element.querySelectorAll('.nav-item');
        
        navToggle.addEventListener('click', () => {
            this.openNavigation(navDrawer, navOverlay);
        });
        
        navClose.addEventListener('click', () => {
            this.closeNavigation(navDrawer, navOverlay);
        });
        
        navOverlay.addEventListener('click', () => {
            this.closeNavigation(navDrawer, navOverlay);
        });
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectNavItem(navItems, item);
                this.closeNavigation(navDrawer, navOverlay);
            });
        });
        
        this.setupDrawerGestures(navDrawer, navOverlay);
    }
    
    openNavigation(drawer, overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    closeNavigation(drawer, overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    selectNavItem(items, selectedItem) {
        items.forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');
    }
    
    setupDrawerGestures(drawer, overlay) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        
        drawer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });
        
        drawer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            // Only allow horizontal swiping
            if (Math.abs(deltaX) > Math.abs(e.touches[0].clientY - startY)) {
                e.preventDefault();
                
                if (deltaX > 0) {
                    // Swiping right - close drawer
                    if (deltaX > 100) {
                        this.closeNavigation(drawer, overlay);
                        isDragging = false;
                    }
                }
            }
        });
        
        drawer.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('mobile-navigation', `
            .mobile-nav-container {
                margin: 1rem 0;
            }
            
            .nav-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-mobile-nav-demo {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                position: relative;
                min-height: 400px;
            }
            
            .mobile-nav {
                position: relative;
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                background: var(--cosmic-darker);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .nav-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                background: var(--cosmic-primary);
                color: white;
            }
            
            .nav-toggle,
            .nav-search,
            .nav-close {
                width: 44px;
                height: 44px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 8px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .nav-toggle:hover,
            .nav-search:hover,
            .nav-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }
            
            .nav-title {
                font-family: var(--font-primary);
                font-weight: 600;
                font-size: 1.1rem;
            }
            
            .nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav-overlay.open {
                opacity: 1;
                visibility: visible;
            }
            
            .nav-drawer {
                position: fixed;
                top: 0;
                left: 0;
                width: 280px;
                height: 100%;
                background: var(--cosmic-darker);
                z-index: 1001;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
            }
            
            .nav-drawer.open {
                transform: translateX(0);
            }
            
            .nav-drawer-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                background: var(--cosmic-primary);
                color: white;
            }
            
            .nav-drawer-title {
                font-family: var(--font-primary);
                font-weight: 600;
                font-size: 1.1rem;
            }
            
            .nav-menu {
                flex: 1;
                padding: 1rem 0;
                overflow-y: auto;
            }
            
            .nav-item {
                display: block;
                padding: 1rem 1.5rem;
                color: var(--cosmic-light);
                text-decoration: none;
                font-family: var(--font-secondary);
                font-size: 1rem;
                transition: all 0.3s ease;
                border-left: 4px solid transparent;
                min-height: 44px;
                display: flex;
                align-items: center;
            }
            
            .nav-item:hover {
                background: var(--cosmic-neutral);
                color: var(--cosmic-accent);
            }
            
            .nav-item.active {
                background: var(--cosmic-primary);
                color: white;
                border-left-color: var(--cosmic-accent);
            }
            
            .nav-content {
                margin-top: 2rem;
                padding: 1rem;
                background: var(--cosmic-darker);
                border-radius: 8px;
            }
            
            .nav-content h3 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .nav-content p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                margin: 0 0 1.5rem 0;
                line-height: 1.6;
            }
            
            .nav-features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                background: var(--cosmic-neutral);
                border-radius: 6px;
            }
            
            .feature-icon {
                font-size: 1.5rem;
            }
            
            .feature-text {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
            }
            
            @media (max-width: 768px) {
                .nav-drawer {
                    width: 100%;
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('mobile-navigation-library', `
            .library-mobile-nav-demo {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                position: relative;
                min-height: 400px;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TouchGestureComponent,
        MobileNavigationComponent
    };
}
