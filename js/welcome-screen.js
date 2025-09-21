/**
 * Welcome Screen System
 * Handles the onboarding experience for new players
 */

class WelcomeScreen {
    constructor() {
        this.isVisible = true;
        this.hasSeenWelcome = false;
        this.tutorialStep = 0;
        this.maxTutorialSteps = 4;
    }

    init() {
        console.log('🌟 Welcome screen initialized');
        this.checkIfFirstVisit();
        this.setupEventListeners();
        this.showWelcomeScreen();
    }

    checkIfFirstVisit() {
        // Check if user has seen the welcome screen before
        const hasSeenWelcome = localStorage.getItem('eldritch_welcome_seen');
        if (hasSeenWelcome === 'true') {
            this.hasSeenWelcome = true;
            this.hideWelcomeScreen();
            // If user has seen welcome before, initialize game immediately
            if (window.eldritchApp) {
                window.eldritchApp.initializeGame();
            }
        }
    }

    setupEventListeners() {
        // Start adventure button
        const startBtn = document.getElementById('start-adventure');
        if (startBtn) {
            console.log('🌟 Start adventure button found, adding event listener');
            startBtn.addEventListener('click', () => {
                console.log('🚀 Start adventure button clicked!');
                this.startAdventure();
            });
        } else {
            console.error('🌟 Start adventure button not found!');
        }

        // Skip tutorial button
        const skipBtn = document.getElementById('skip-tutorial');
        if (skipBtn) {
            console.log('🌟 Skip tutorial button found, adding event listener');
            skipBtn.addEventListener('click', () => {
                console.log('⏭️ Skip tutorial button clicked!');
                this.skipTutorial();
            });
        } else {
            console.error('🌟 Skip tutorial button not found!');
        }

        // Close welcome screen on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.skipTutorial();
            }
        });
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
            this.isVisible = true;
            this.animateWelcomeScreen();
        }
    }

    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
            this.isVisible = false;
        }
    }

    animateWelcomeScreen() {
        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            welcomeContent.style.opacity = '0';
            welcomeContent.style.transform = 'scale(0.8) translateY(50px)';
            
            setTimeout(() => {
                welcomeContent.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                welcomeContent.style.opacity = '1';
                welcomeContent.style.transform = 'scale(1) translateY(0)';
            }, 100);
        }
    }

    startAdventure() {
        console.log('🚀 Starting cosmic adventure!');
        
        // Mark welcome as seen
        localStorage.setItem('eldritch_welcome_seen', 'true');
        this.hasSeenWelcome = true;
        
        // Hide welcome screen with animation
        console.log('🌟 Animating out welcome screen...');
        this.animateOut(() => {
            console.log('🌟 Hiding welcome screen and initializing game...');
            this.hideWelcomeScreen();
            this.initializeGame();
        });
    }

    skipTutorial() {
        console.log('⏭️ Skipping tutorial');
        
        // Mark welcome as seen
        localStorage.setItem('eldritch_welcome_seen', 'true');
        this.hasSeenWelcome = true;
        
        // Hide welcome screen immediately
        this.hideWelcomeScreen();
        this.initializeGame();
    }


    animateOut(callback) {
        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            welcomeContent.style.transition = 'all 0.5s ease-in-out';
            welcomeContent.style.opacity = '0';
            welcomeContent.style.transform = 'scale(0.8) translateY(-50px)';
            
            setTimeout(() => {
                if (callback) callback();
            }, 200);
        } else {
            if (callback) callback();
        }
    }

    initializeGame() {
        console.log('🎮 Initializing game systems...');
        
        // Initialize the main app
        if (window.eldritchApp) {
            console.log('🌌 Main app found, calling initializeGame...');
            window.eldritchApp.initializeGame();
        } else {
            console.error('🌌 Main app not found!');
            console.log('🌌 Available window objects:', Object.keys(window).filter(key => key.includes('App') || key.includes('app')));
        }
        
        // The particle loading screen will handle its own timing
        setTimeout(() => {
            console.log('🌟 Showing game tips...');
            this.showGameTips();
        }, 2000);
    }

    showGameTips() {
        // Show some helpful tips after the game loads
        setTimeout(() => {
            this.showTip('💡 Welcome to Eldritch Sanctuary! Use the debug console (🔧) to test features and see your progress.');
        }, 500);
        
        setTimeout(() => {
            this.showTip('🌟 Try clicking on the HEVY marker to start your first legendary encounter!');
        }, 2000);
    }

    showTip(message) {
        // Create a temporary tip notification
        const tip = document.createElement('div');
        tip.className = 'game-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <span class="tip-icon">💡</span>
                <span class="tip-text">${message}</span>
                <button class="tip-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add tip styles
        tip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #000;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
            z-index: 1000;
            max-width: 400px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(tip);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (tip.parentElement) {
                tip.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => tip.remove(), 500);
            }
        }, 8000);
    }

    // Method to reset welcome screen (for testing)
    resetWelcome() {
        localStorage.removeItem('eldritch_welcome_seen');
        this.hasSeenWelcome = false;
        this.showWelcomeScreen();
    }

    // Method to show welcome screen again (for testing)
    showWelcomeAgain() {
        this.showWelcomeScreen();
    }
}

// Add CSS for game tips
const tipStyles = document.createElement('style');
tipStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .game-tip {
        font-family: 'Arial', sans-serif;
    }
    
    .tip-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .tip-icon {
        font-size: 1.2rem;
    }
    
    .tip-text {
        flex: 1;
        font-weight: 500;
    }
    
    .tip-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .tip-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(tipStyles);

// Make welcome screen globally available
window.WelcomeScreen = WelcomeScreen;
