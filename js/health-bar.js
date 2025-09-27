/**
 * Centralized Health Bar System
 * Manages health display without DOM conflicts
 */
class HealthBar {
    constructor() {
        this.currentHealth = 100;
        this.maxHealth = 100;
        this.currentSanity = 100;
        this.maxSanity = 100;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        console.log('â¤ï¸ Initializing Health Bar System...');
        
        // Create health bar container if it doesn't exist
        this.createHealthBar();
        
        // Set up update interval to prevent conflicts
        this.updateInterval = setInterval(() => {
            this.render();
        }, 100); // Update every 100ms
        
        this.isInitialized = true;
        console.log('â¤ï¸ Health Bar System initialized');
    }
    
    createHealthBar() {
        // Find the existing health element
        const healthEl = document.getElementById('health-value');
        const sanityEl = document.getElementById('sanity-value');
        
        if (healthEl) {
            // Create a wrapper div for the health bar
            const healthContainer = document.createElement('div');
            healthContainer.className = 'health-bar-container';
            healthContainer.innerHTML = `
                <div class="health-bar">
                    <div class="health-bar-fill" id="health-bar-fill"></div>
                    <div class="health-bar-text" id="health-bar-text">${this.currentHealth}/${this.maxHealth}</div>
                </div>
            `;
            
            // Replace the original element
            healthEl.parentNode.replaceChild(healthContainer, healthEl);
        }
        
        if (sanityEl) {
            // Create a wrapper div for the sanity bar
            const sanityContainer = document.createElement('div');
            sanityContainer.className = 'sanity-bar-container';
            sanityContainer.innerHTML = `
                <div class="sanity-bar">
                    <div class="sanity-bar-fill" id="sanity-bar-fill"></div>
                    <div class="sanity-bar-text" id="sanity-bar-text">${this.currentSanity}/${this.maxSanity}</div>
                </div>
            `;
            
            // Replace the original element
            sanityEl.parentNode.replaceChild(sanityContainer, sanityEl);
        }
    }
    
    setHealth(current, max = 100) {
        this.currentHealth = Math.max(0, Math.min(current, max));
        this.maxHealth = max;
        console.log(`â¤ï¸ Health updated: ${this.currentHealth}/${this.maxHealth}`);
    }
    
    setSanity(current, max = 100) {
        this.currentSanity = Math.max(0, Math.min(current, max));
        this.maxSanity = max;
        console.log(`ðŸ§  Sanity updated: ${this.currentSanity}/${this.maxSanity}`);
    }
    
    render() {
        if (!this.isInitialized) return;
        
        // Update health bar
        const healthFill = document.getElementById('health-bar-fill');
        const healthText = document.getElementById('health-bar-text');
        
        if (healthFill && healthText) {
            const healthPercentage = (this.currentHealth / this.maxHealth) * 100;
            healthFill.style.width = `${healthPercentage}%`;
            healthText.textContent = `${this.currentHealth}/${this.maxHealth}`;
            
            // Color coding based on health level
            if (healthPercentage > 75) {
                healthFill.style.backgroundColor = '#4CAF50'; // Green
            } else if (healthPercentage > 50) {
                healthFill.style.backgroundColor = '#FF9800'; // Orange
            } else if (healthPercentage > 25) {
                healthFill.style.backgroundColor = '#FF5722'; // Red-orange
            } else {
                healthFill.style.backgroundColor = '#F44336'; // Red
            }
        }
        
        // Update sanity bar
        const sanityFill = document.getElementById('sanity-bar-fill');
        const sanityText = document.getElementById('sanity-bar-text');
        
        if (sanityFill && sanityText) {
            const sanityPercentage = (this.currentSanity / this.maxSanity) * 100;
            sanityFill.style.width = `${sanityPercentage}%`;
            sanityText.textContent = `${this.currentSanity}/${this.maxSanity}`;
            
            // Color coding based on sanity level
            if (sanityPercentage > 75) {
                sanityFill.style.backgroundColor = '#2196F3'; // Blue
            } else if (sanityPercentage > 50) {
                sanityFill.style.backgroundColor = '#9C27B0'; // Purple
            } else if (sanityPercentage > 25) {
                sanityFill.style.backgroundColor = '#E91E63'; // Pink
            } else {
                sanityFill.style.backgroundColor = '#FF1744'; // Dark red
            }
        }
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.isInitialized = false;
        console.log('â¤ï¸ Health Bar System destroyed');
    }
}

// Make globally available
window.HealthBar = HealthBar;


