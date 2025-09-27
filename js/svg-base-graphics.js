/**
 * SVG Base Graphics System
 * Handles all SVG-based base graphics, animations, and visual effects
 * 
 * Features:
 * - Animated expanding circle for base territory
 * - Flag icons (Finnish/Swedish) with waving animation
 * - Base customization (color, shape, size)
 * - Particle effects for interactions
 * - Add-on building icons
 */

class SVGBaseGraphics {
    constructor() {
        this.baseConfig = {
            size: 240, // Base marker size (3x player icon)
            territoryRadius: 120, // Territory circle radius
            flagSize: 40, // Flag icon size
            addonSize: 24, // Add-on icon size
            colors: {
                primary: '#8b5cf6', // Purple
                secondary: '#3b82f6', // Blue
                accent: '#f59e0b', // Orange
                territory: 'rgba(139, 92, 246, 0.3)', // Semi-transparent purple
                flag: '#ffffff' // White for flag
            },
            animations: {
                territoryPulse: 2000, // Territory circle pulse duration (ms)
                flagWave: 3000, // Flag waving animation duration (ms)
                addonGlow: 1000, // Add-on glow effect duration (ms)
                particleLife: 2000 // Particle effect duration (ms)
            }
        };
        
        this.currentBase = null;
        this.territoryAnimation = null;
        this.flagAnimation = null;
        this.particleSystem = null;
    }

    /**
     * Create the main base SVG structure
     * @param {Object} config - Base configuration
     * @returns {string} SVG HTML string
     */
    createBaseSVG(config = {}) {
        const baseConfig = { ...this.baseConfig, ...config };
        const { size, territoryRadius, flagSize, colors } = baseConfig;
        
        return `
            <div class="svg-base-container" style="
                width: ${size}px;
                height: ${size}px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
                     style="position: absolute; top: 0; left: 0;">
                    
                    <!-- Territory Circle (Animated) -->
                    <circle class="territory-circle" 
                            cx="${size/2}" cy="${size/2}" 
                            r="${territoryRadius}" 
                            fill="${colors.territory}" 
                            stroke="${colors.primary}" 
                            stroke-width="2"
                            opacity="0.6">
                        <animate attributeName="r" 
                                 values="${territoryRadius};${territoryRadius * 1.2};${territoryRadius}" 
                                 dur="${baseConfig.animations.territoryPulse}ms" 
                                 repeatCount="indefinite" />
                        <animate attributeName="opacity" 
                                 values="0.6;0.8;0.6" 
                                 dur="${baseConfig.animations.territoryPulse}ms" 
                                 repeatCount="indefinite" />
                    </circle>
                    
                    <!-- Base Center Circle -->
                    <circle class="base-center" 
                            cx="${size/2}" cy="${size/2}" 
                            r="30" 
                            fill="${colors.primary}" 
                            stroke="${colors.secondary}" 
                            stroke-width="3" />
                    
                    <!-- Flag Container -->
                    <g class="flag-container" transform="translate(${size/2 - flagSize/2}, ${size/2 - flagSize/2})">
                        ${this.createFlagSVG(flagSize, colors.flag)}
                    </g>
                    
                    <!-- Add-ons Container -->
                    <g class="addons-container">
                        <!-- Add-ons will be dynamically added here -->
                    </g>
                    
                    <!-- Particle Effects Container -->
                    <g class="particle-effects">
                        <!-- Particles will be dynamically added here -->
                    </g>
                </svg>
                
                <!-- Clickable Overlay -->
                <div class="base-click-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    z-index: 10;
                "></div>
            </div>
        `;
    }

    /**
     * Create flag SVG (Finnish or Swedish)
     * @param {number} size - Flag size
     * @param {string} color - Flag color
     * @param {string} type - Flag type ('finnish' or 'swedish')
     * @returns {string} Flag SVG string
     */
    createFlagSVG(size, color, type = 'finnish') {
        const waveOffset = 2; // Wave animation offset
        
        if (type === 'finnish') {
            return `
                <g class="finnish-flag">
                    <!-- Finnish Flag Design -->
                    <rect x="0" y="0" width="${size}" height="${size}" fill="${color}" />
                    <rect x="${size * 0.4}" y="0" width="${size * 0.2}" height="${size}" fill="#003580" />
                    <rect x="0" y="${size * 0.4}" width="${size}" height="${size * 0.2}" fill="#003580" />
                    
                    <!-- Wave Animation -->
                    <animateTransform attributeName="transform" 
                                      type="translate" 
                                      values="0,0; 0,${waveOffset}; 0,0" 
                                      dur="${this.baseConfig.animations.flagWave}ms" 
                                      repeatCount="indefinite" />
                </g>
            `;
        } else if (type === 'swedish') {
            return `
                <g class="swedish-flag">
                    <!-- Swedish Flag Design -->
                    <rect x="0" y="0" width="${size}" height="${size}" fill="${color}" />
                    <rect x="${size * 0.35}" y="0" width="${size * 0.3}" height="${size}" fill="#006AA7" />
                    <rect x="0" y="${size * 0.35}" width="${size}" height="${size * 0.3}" fill="#006AA7" />
                    
                    <!-- Wave Animation -->
                    <animateTransform attributeName="transform" 
                                      type="translate" 
                                      values="0,0; 0,${waveOffset}; 0,0" 
                                      dur="${this.baseConfig.animations.flagWave}ms" 
                                      repeatCount="indefinite" />
                </g>
            `;
        }
        
        return `<circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${color}" />`;
    }

    /**
     * Create add-on building SVG
     * @param {string} addonType - Type of add-on
     * @param {Object} position - Position relative to base center
     * @returns {string} Add-on SVG string
     */
    createAddonSVG(addonType, position) {
        const { addonSize } = this.baseConfig;
        const { x, y } = position;
        
        const addonIcons = {
            stepBooster: {
                icon: '⚡',
                color: '#f59e0b',
                description: 'Step Booster'
            },
            shrine: {
                icon: '🏛️',
                color: '#8b5cf6',
                description: 'Cosmic Shrine'
            },
            armoury: {
                icon: '⚔️',
                color: '#ef4444',
                description: 'Defense Armoury'
            },
            walls: {
                icon: '🏰',
                color: '#6b7280',
                description: 'Defensive Walls'
            }
        };
        
        const addon = addonIcons[addonType] || addonIcons.stepBooster;
        
        return `
            <g class="addon-${addonType}" transform="translate(${x - addonSize/2}, ${y - addonSize/2})">
                <circle cx="${addonSize/2}" cy="${addonSize/2}" 
                        r="${addonSize/2 + 2}" 
                        fill="${addon.color}" 
                        opacity="0.8" />
                <text x="${addonSize/2}" y="${addonSize/2 + 4}" 
                      text-anchor="middle" 
                      font-size="${addonSize * 0.6}" 
                      fill="white">
                    ${addon.icon}
                </text>
                
                <!-- Glow Effect -->
                <circle cx="${addonSize/2}" cy="${addonSize/2}" 
                        r="${addonSize/2 + 4}" 
                        fill="none" 
                        stroke="${addon.color}" 
                        stroke-width="1" 
                        opacity="0">
                    <animate attributeName="opacity" 
                             values="0;0.6;0" 
                             dur="${this.baseConfig.animations.addonGlow}ms" 
                             repeatCount="indefinite" />
                    <animate attributeName="r" 
                             values="${addonSize/2 + 4};${addonSize/2 + 8};${addonSize/2 + 4}" 
                             dur="${this.baseConfig.animations.addonGlow}ms" 
                             repeatCount="indefinite" />
                </circle>
            </g>
        `;
    }

    /**
     * Create particle effect SVG
     * @param {Object} config - Particle configuration
     * @returns {string} Particle SVG string
     */
    createParticleEffect(config = {}) {
        const { x = 120, y = 120, color = '#8b5cf6', count = 8 } = config;
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const particleX = x + Math.cos(angle) * distance;
            const particleY = y + Math.sin(angle) * distance;
            const size = 2 + Math.random() * 3;
            
            particles.push(`
                <circle cx="${particleX}" cy="${particleY}" 
                        r="${size}" 
                        fill="${color}" 
                        opacity="0.8">
                    <animate attributeName="opacity" 
                             values="0.8;0;0.8" 
                             dur="${this.baseConfig.animations.particleLife}ms" 
                             repeatCount="1" />
                    <animateTransform attributeName="transform" 
                                      type="translate" 
                                      values="0,0; ${Math.cos(angle) * 40},${Math.sin(angle) * 40}" 
                                      dur="${this.baseConfig.animations.particleLife}ms" 
                                      repeatCount="1" />
                </circle>
            `);
        }
        
        return particles.join('');
    }

    /**
     * Update base configuration
     * @param {Object} newConfig - New configuration
     */
    updateBaseConfig(newConfig) {
        this.baseConfig = { ...this.baseConfig, ...newConfig };
    }

    /**
     * Get base configuration
     * @returns {Object} Current configuration
     */
    getBaseConfig() {
        return { ...this.baseConfig };
    }

    /**
     * Create base marker for Leaflet
     * @param {Object} config - Base configuration
     * @returns {Object} Leaflet divIcon configuration
     */
    createLeafletBaseIcon(config = {}) {
        const baseConfig = { ...this.baseConfig, ...config };
        const svgHTML = this.createBaseSVG(baseConfig);
        
        return {
            className: 'svg-base-marker',
            html: svgHTML,
            iconSize: [baseConfig.size, baseConfig.size],
            iconAnchor: [baseConfig.size / 2, baseConfig.size / 2]
        };
    }

    /**
     * Add add-on to base
     * @param {string} addonType - Type of add-on
     * @param {Object} position - Position relative to base center
     */
    addAddon(addonType, position) {
        // This will be called when add-ons are purchased
        console.log(`🏗️ Adding ${addonType} add-on at position:`, position);
        
        // In a real implementation, this would update the SVG
        // For now, we'll just log the action
    }

    /**
     * Trigger particle effect
     * @param {Object} config - Particle configuration
     */
    triggerParticleEffect(config = {}) {
        console.log('✨ Triggering particle effect:', config);
        
        // In a real implementation, this would add particles to the SVG
        // For now, we'll just log the action
    }

    /**
     * Update base appearance
     * @param {Object} appearance - Appearance configuration
     */
    updateBaseAppearance(appearance) {
        console.log('🎨 Updating base appearance:', appearance);
        
        // In a real implementation, this would update the SVG colors, shapes, etc.
        // For now, we'll just log the action
    }
}

// Export for use in other modules
window.SVGBaseGraphics = SVGBaseGraphics;
