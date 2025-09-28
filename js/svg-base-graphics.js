/**
 * BRDC: SVG Base Graphics System
 * 
 * This system handles all SVG-based base graphics and animations for the Eldritch Sanctuary.
 * Implements the "Sacred Pattern" for visual consistency and cosmic theming.
 * 
 * Features:
 * - Animated expanding territory circles
 * - Flag waving animations (Finnish/Swedish)
 * - Base customization (color, shape, size)
 * - Particle effects for interactions
 * - Cosmic energy visualizations
 * 
 * Implements: #feature-base-building
 * Uses: #feature-marker-system
 * Enhances: #enhancement-svg-graphics
 * 
 * @author Aurora
 * @version 1.0.0
 * @created 2025-01-28
 */

class SVGBaseGraphics {
    constructor() {
        this.baseMarkers = new Map(); // Store active base markers
        this.animations = new Map(); // Store animation references
        this.particleSystems = new Map(); // Store particle effects
        
        // Default base configuration
        this.defaultConfig = {
            size: 240, // 3x player icon size
            territoryRadius: 50, // meters
            colors: {
                primary: '#8b5cf6', // Purple
                secondary: '#3b82f6', // Blue
                accent: '#f59e0b', // Amber
                energy: '#10b981' // Emerald
            },
            animations: {
                territoryPulse: true,
                flagWave: true,
                particleEffects: true,
                energyGlow: true
            }
        };
        
        console.log('🎨 SVG Base Graphics System initialized');
    }
    
    /**
     * BRDC: Create animated base marker with SVG graphics
     * 
     * Creates a complete base marker with territory circle, flag, and particle effects.
     * Uses the "Sacred Pattern" for consistent visual design.
     * Automatically scales based on current map zoom level.
     * 
     * @param {Object} position - {lat: number, lng: number} coordinates
     * @param {Object} config - Base configuration options
     * @param {string} flagType - 'finnish' or 'swedish'
     * @param {Object} map - Leaflet map instance for zoom detection
     * @returns {Object} - Leaflet marker with SVG graphics
     */
    createAnimatedBaseMarker(position, config = {}, flagType = 'finnish', map = null, baseType = 'own') {
        console.log('🎨 Creating animated base marker at:', position);
        
        const finalConfig = { ...this.defaultConfig, ...config };
        
        // Modify config based on base type
        if (baseType === 'other') {
            finalConfig.colors = {
                primary: '#6b7280',    // Gray for other players
                secondary: '#4b5563',
                accent: '#9ca3af',
                energy: '#d1d5db',
                territory: '#6b7280'
            };
            finalConfig.animations = {
                territoryPulse: false,  // No pulsing for other bases
                energyGlow: false,      // No energy glow
                flagWave: true,         // Keep flag waving
                particleEffects: false  // No particles for other bases
            };
        }
        
        const markerId = `base_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get current zoom level for initial scaling
        let currentZoom = 13; // Default zoom level
        if (map) {
            currentZoom = map.getZoom();
        } else if (window.map) {
            currentZoom = window.map.getZoom();
        }
        
        console.log(`🎨 Creating base marker at zoom level: ${currentZoom}`);
        
        // Calculate initial scale based on current zoom
        const initialScale = this.calculateZoomScale(currentZoom);
        const initialSize = Math.round(finalConfig.size * initialScale);
        
        console.log(`🎨 Initial scale: ${initialScale.toFixed(2)}, Initial size: ${initialSize}px`);
        
        // Create SVG container with initial scaling
        const svgContainer = this.createSVGContainer(finalConfig, markerId);
        
        // Create territory circle
        const territoryCircle = this.createTerritoryCircle(finalConfig);
        
        // Create base structure
        const baseStructure = this.createBaseStructure(finalConfig);
        
        // Create flag
        const flag = this.createFlag(flagType, finalConfig);
        
        // Create particle system
        const particles = this.createParticleSystem(finalConfig);
        
        // Assemble SVG
        svgContainer.appendChild(territoryCircle);
        svgContainer.appendChild(baseStructure);
        svgContainer.appendChild(flag);
        svgContainer.appendChild(particles);
        
        // Scale the SVG content for current zoom level
        const scaledSVG = this.createScaledSVG(svgContainer.outerHTML, initialScale, initialSize);
        
        // Create Leaflet divIcon with zoom-appropriate size
        const baseIcon = L.divIcon({
            className: 'svg-base-marker clickable-marker',
            html: scaledSVG,
            iconSize: [initialSize, initialSize],
            iconAnchor: [initialSize / 2, initialSize / 2]
        });
        
        // Create marker
        const marker = L.marker([position.lat, position.lng], { 
            icon: baseIcon,
            zIndexOffset: 600 // Higher than other markers
        });
        
        // Store marker reference with original SVG content
        this.baseMarkers.set(markerId, {
            marker: marker,
            config: finalConfig,
            flagType: flagType,
            position: position,
            originalSize: finalConfig.size,
            originalSVG: svgContainer.outerHTML, // Store the original SVG content
            currentZoom: currentZoom,
            currentScale: initialScale
        });
        
        // Add zoom event listener for dynamic scaling
        this.addZoomScaling(markerId, marker);
        
        // Start animations
        this.startBaseAnimations(markerId);
        
        console.log('🎨 Animated base marker created successfully with zoom-appropriate size');
        return marker;
    }
    
    /**
     * BRDC: Create SVG container with cosmic styling
     * 
     * @param {Object} config - Base configuration
     * @param {string} markerId - Unique marker identifier
     * @returns {HTMLElement} - SVG container element
     */
    createSVGContainer(config, markerId) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', config.size);
        svg.setAttribute('height', config.size);
        svg.setAttribute('viewBox', `0 0 ${config.size} ${config.size}`);
        svg.setAttribute('class', 'svg-base-container');
        svg.setAttribute('data-marker-id', markerId);
        
        // Add cosmic styling
        svg.style.cssText = `
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
            animation: baseGlow 3s ease-in-out infinite alternate;
        `;
        
        return svg;
    }
    
    /**
     * BRDC: Create animated territory circle
     * 
     * Creates the expanding cosmic energy circle that represents base territory.
     * 
     * @param {Object} config - Base configuration
     * @returns {HTMLElement} - Territory circle element
     */
    createTerritoryCircle(config) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'territory-circle');
        
        const center = config.size / 2;
        const radius = center * 0.8; // 80% of container size
        
        // Create gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'territoryGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', config.colors.primary);
        stop1.setAttribute('stop-opacity', '0.8');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', config.colors.primary);
        stop2.setAttribute('stop-opacity', '0.2');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        group.appendChild(defs);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', center);
        circle.setAttribute('cy', center);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', 'url(#territoryGradient)');
        circle.setAttribute('stroke', config.colors.primary);
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('opacity', '0.7');
        
        // Add pulsing animation
        if (config.animations.territoryPulse) {
            circle.style.animation = 'territoryPulse 2s ease-in-out infinite';
        }
        
        group.appendChild(circle);
        return group;
    }
    
    /**
     * BRDC: Create base structure with cosmic energy
     * 
     * Creates the central base structure with energy rings and cosmic core.
     * 
     * @param {Object} config - Base configuration
     * @returns {HTMLElement} - Base structure group
     */
    createBaseStructure(config) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'base-structure');
        
        const center = config.size / 2;
        
        // Outer energy ring
        const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerRing.setAttribute('cx', center);
        outerRing.setAttribute('cy', center);
        outerRing.setAttribute('r', center * 0.3);
        outerRing.setAttribute('fill', 'none');
        outerRing.setAttribute('stroke', config.colors.secondary);
        outerRing.setAttribute('stroke-width', '2');
        outerRing.setAttribute('opacity', '0.8');
        outerRing.setAttribute('class', 'outer-energy-ring');
        
        if (config.animations.energyGlow) {
            outerRing.style.animation = 'energyRingRotate 4s linear infinite';
        }
        
        // Inner cosmic core
        const cosmicCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cosmicCore.setAttribute('cx', center);
        cosmicCore.setAttribute('cy', center);
        cosmicCore.setAttribute('r', center * 0.15);
        cosmicCore.setAttribute('fill', config.colors.primary);
        cosmicCore.setAttribute('opacity', '0.9');
        cosmicCore.setAttribute('class', 'cosmic-core');
        
        if (config.animations.energyGlow) {
            cosmicCore.style.animation = 'cosmicCorePulse 1.5s ease-in-out infinite';
        }
        
        // Central star symbol
        const star = this.createStarSymbol(center, center, center * 0.1, config.colors.accent);
        star.setAttribute('class', 'central-star');
        
        group.appendChild(outerRing);
        group.appendChild(cosmicCore);
        group.appendChild(star);
        
        return group;
    }
    
    /**
     * BRDC: Create star symbol for cosmic core
     * 
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} size - Star size
     * @param {string} color - Star color
     * @returns {HTMLElement} - Star element
     */
    createStarSymbol(x, y, size, color) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Create 5-pointed star path
        const points = [];
        for (let i = 0; i < 5; i++) {
            const angle = (i * 144 - 90) * Math.PI / 180; // 144 degrees between points
            const outerX = x + Math.cos(angle) * size;
            const outerY = y + Math.sin(angle) * size;
            const innerAngle = ((i + 0.5) * 144 - 90) * Math.PI / 180;
            const innerX = x + Math.cos(innerAngle) * (size * 0.4);
            const innerY = y + Math.sin(innerAngle) * (size * 0.4);
            
            if (i === 0) {
                points.push(`M ${outerX} ${outerY}`);
            } else {
                points.push(`L ${outerX} ${outerY}`);
            }
            points.push(`L ${innerX} ${innerY}`);
        }
        points.push('Z');
        
        star.setAttribute('d', points.join(' '));
        star.setAttribute('fill', color);
        star.setAttribute('opacity', '0.9');
        
        return star;
    }
    
    /**
     * BRDC: Create flag with waving animation
     * 
     * @param {string} flagType - 'finnish' or 'swedish'
     * @param {Object} config - Base configuration
     * @returns {HTMLElement} - Flag element
     */
    createFlag(flagType, config) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'flag-container');
        
        const center = config.size / 2;
        const flagWidth = config.size * 0.2;
        const flagHeight = config.size * 0.3;
        
        // Flag pole
        const pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pole.setAttribute('x', center - 2);
        pole.setAttribute('y', center - config.size * 0.4);
        pole.setAttribute('width', '4');
        pole.setAttribute('height', config.size * 0.4);
        pole.setAttribute('fill', '#8b4513'); // Brown pole
        pole.setAttribute('class', 'flag-pole');
        
        // Flag
        const flag = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        flag.setAttribute('x', center + 2);
        flag.setAttribute('y', center - config.size * 0.4);
        flag.setAttribute('width', flagWidth);
        flag.setAttribute('height', flagHeight);
        flag.setAttribute('class', `flag-${flagType}`);
        
        // Add flag colors based on type
        if (flagType === 'finnish') {
            flag.setAttribute('fill', '#ffffff'); // White background
            
            // Add blue cross (vertical bar) - draw AFTER flag so it appears on top
            const verticalCross = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            verticalCross.setAttribute('x', center + 2 + flagWidth * 0.4);
            verticalCross.setAttribute('y', center - config.size * 0.4);
            verticalCross.setAttribute('width', flagWidth * 0.2);
            verticalCross.setAttribute('height', flagHeight);
            verticalCross.setAttribute('fill', '#003580'); // Blue cross
            verticalCross.setAttribute('z-index', '10'); // Ensure it's on top
            
            // Add blue cross (horizontal bar) - draw AFTER flag so it appears on top
            const horizontalCross = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            horizontalCross.setAttribute('x', center + 2);
            horizontalCross.setAttribute('y', center - config.size * 0.4 + flagHeight * 0.4);
            horizontalCross.setAttribute('width', flagWidth);
            horizontalCross.setAttribute('height', flagHeight * 0.2);
            horizontalCross.setAttribute('fill', '#003580'); // Blue cross
            horizontalCross.setAttribute('z-index', '10'); // Ensure it's on top
            
            // Add waving animation to cross elements
            if (config.animations.flagWave) {
                verticalCross.style.animation = 'flagWave 2s ease-in-out infinite';
                horizontalCross.style.animation = 'flagWave 2s ease-in-out infinite';
            }
            
            // Add elements in correct order: flag first, then crosses on top
            group.appendChild(flag);
            group.appendChild(verticalCross);
            group.appendChild(horizontalCross);
        } else if (flagType === 'swedish') {
            flag.setAttribute('fill', '#006aa7'); // Blue background
            
            // Add yellow cross (vertical bar) - draw AFTER flag so it appears on top
            const verticalCross = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            verticalCross.setAttribute('x', center + 2 + flagWidth * 0.4);
            verticalCross.setAttribute('y', center - config.size * 0.4);
            verticalCross.setAttribute('width', flagWidth * 0.2);
            verticalCross.setAttribute('height', flagHeight);
            verticalCross.setAttribute('fill', '#fecd00'); // Yellow cross
            verticalCross.setAttribute('z-index', '10'); // Ensure it's on top
            
            // Add yellow cross (horizontal bar) - draw AFTER flag so it appears on top
            const horizontalCross = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            horizontalCross.setAttribute('x', center + 2);
            horizontalCross.setAttribute('y', center - config.size * 0.4 + flagHeight * 0.4);
            horizontalCross.setAttribute('width', flagWidth);
            horizontalCross.setAttribute('height', flagHeight * 0.2);
            horizontalCross.setAttribute('fill', '#fecd00'); // Yellow cross
            horizontalCross.setAttribute('z-index', '10'); // Ensure it's on top
            
            // Add waving animation to cross elements
            if (config.animations.flagWave) {
                verticalCross.style.animation = 'flagWave 2s ease-in-out infinite';
                horizontalCross.style.animation = 'flagWave 2s ease-in-out infinite';
            }
            
            // Add elements in correct order: flag first, then crosses on top
            group.appendChild(flag);
            group.appendChild(verticalCross);
            group.appendChild(horizontalCross);
        } else {
            // Default flag (no cross)
            group.appendChild(flag);
        }
        
        // Add waving animation to flag background
        if (config.animations.flagWave) {
            flag.style.animation = 'flagWave 2s ease-in-out infinite';
        }
        
        // Add flag pole first (behind everything)
        group.appendChild(pole);
        
        return group;
    }
    
    /**
     * BRDC: Create particle system for cosmic effects
     * 
     * @param {Object} config - Base configuration
     * @returns {HTMLElement} - Particle system group
     */
    createParticleSystem(config) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'particle-system');
        
        if (!config.animations.particleEffects) {
            return group;
        }
        
        const center = config.size / 2;
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (i / particleCount) * 2 * Math.PI;
            const radius = center * 0.6;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            particle.setAttribute('r', '1'); // Smaller particles
            particle.setAttribute('fill', config.colors.energy);
            particle.setAttribute('opacity', '0.6');
            particle.setAttribute('class', 'cosmic-particle');
            
            // Add floating animation with different delays
            particle.style.animation = `particleFloat ${2 + Math.random() * 2}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            group.appendChild(particle);
        }
        
        return group;
    }
    
    /**
     * BRDC: Start base animations
     * 
     * @param {string} markerId - Marker identifier
     */
    startBaseAnimations(markerId) {
        const baseData = this.baseMarkers.get(markerId);
        if (!baseData) return;
        
        console.log('🎨 Starting animations for base marker:', markerId);
        
        // Store animation references for cleanup
        this.animations.set(markerId, {
            territoryPulse: true,
            flagWave: true,
            particleFloat: true,
            energyGlow: true
        });
    }
    
    /**
     * BRDC: Add zoom-based scaling to base marker
     * 
     * This method adds event listeners to scale the base marker based on map zoom level.
     * The marker will appear larger when zoomed in and smaller when zoomed out.
     * 
     * @param {string} markerId - Marker identifier
     * @param {Object} marker - Leaflet marker object
     */
    addZoomScaling(markerId, marker) {
        const baseData = this.baseMarkers.get(markerId);
        if (!baseData || !marker._map) return;
        
        // Define zoom scaling factors
        // Lower zoom = farther away = smaller markers
        // Higher zoom = closer = larger markers
        const zoomScaling = {
            minZoom: 1,   // Minimum zoom level (whole world)
            maxZoom: 18,  // Maximum zoom level (street level)
            minScale: 0.1, // Minimum scale (10% of original size) - for whole world view
            maxScale: 1.0  // Maximum scale (100% of original size) - for street level
        };
        
        // Calculate scale based on zoom level
        // Higher zoom levels = larger markers (closer view)
        // Lower zoom levels = smaller markers (farther view)
        const calculateScale = (zoomLevel) => {
            if (zoomLevel <= zoomScaling.minZoom) {
                return zoomScaling.minScale;
            } else if (zoomLevel >= zoomScaling.maxZoom) {
                return zoomScaling.maxScale;
            } else {
                // Linear interpolation between min and max scale
                const zoomRange = zoomScaling.maxZoom - zoomScaling.minZoom;
                const scaleRange = zoomScaling.maxScale - zoomScaling.minScale;
                const zoomProgress = (zoomLevel - zoomScaling.minZoom) / zoomRange;
                return zoomScaling.minScale + (scaleRange * zoomProgress);
            }
        };
        
        // Apply scaling to marker
        const applyScaling = (zoomLevel) => {
            const scale = calculateScale(zoomLevel);
            const newSize = Math.round(baseData.originalSize * scale);
            
            console.log(`🎨 Applying scaling - Zoom: ${zoomLevel}, Scale: ${scale.toFixed(2)}, New Size: ${newSize}px`);
            
            // Create scaled SVG content
            const scaledSVG = this.createScaledSVG(baseData.originalSVG, scale, newSize);
            
            // Create new icon with scaled SVG content
            const newIcon = L.divIcon({
            className: 'svg-base-marker',
                html: scaledSVG,
                iconSize: [newSize, newSize],
                iconAnchor: [newSize / 2, newSize / 2]
            });
            
            // Update the marker with new icon
            marker.setIcon(newIcon);
            
            console.log(`🎨 Base marker ${markerId} scaled to ${newSize}px (zoom: ${zoomLevel}, scale: ${scale.toFixed(2)})`);
        };
        
        // Add zoom event listener
        const zoomHandler = (e) => {
            const zoomLevel = marker._map.getZoom();
            console.log(`🔍 Zoom event triggered for marker ${markerId}, zoom level: ${zoomLevel}`);
            applyScaling(zoomLevel);
        };
        
        // Store zoom handler for cleanup
        baseData.zoomHandler = zoomHandler;
        
        // Add event listener to map - use both events for better coverage
        marker._map.on('zoomend', zoomHandler);
        marker._map.on('zoom', zoomHandler);
        
        // Also add to zoomstart for immediate feedback
        marker._map.on('zoomstart', zoomHandler);
        
        console.log('🎨 Added zoom event listeners to map for marker:', markerId);
        
        // Apply initial scaling
        const initialZoom = marker._map.getZoom();
        console.log(`🎨 Initial zoom level: ${initialZoom}`);
        applyScaling(initialZoom);
        
        console.log('🎨 Zoom scaling added to base marker:', markerId);
    }
    
    /**
     * BRDC: Update base marker configuration
     * 
     * @param {string} markerId - Marker identifier
     * @param {Object} newConfig - New configuration
     */
    updateBaseMarker(markerId, newConfig) {
        const baseData = this.baseMarkers.get(markerId);
        if (!baseData) {
            console.warn('⚠️ Base marker not found:', markerId);
            return;
        }
        
        console.log('🎨 Updating base marker configuration:', markerId);
        
        // Update configuration
        baseData.config = { ...baseData.config, ...newConfig };
        
        // Recreate marker with new configuration
        const newMarker = this.createAnimatedBaseMarker(
            baseData.position, 
            baseData.config, 
            baseData.flagType
        );
        
        // Replace old marker
        if (baseData.marker && baseData.marker._map) {
            baseData.marker._map.removeLayer(baseData.marker);
        }
        
        baseData.marker = newMarker;
        this.baseMarkers.set(markerId, baseData);
        
        console.log('🎨 Base marker updated successfully');
    }
    
    /**
     * BRDC: Remove base marker and cleanup
     * 
     * @param {string} markerId - Marker identifier
     */
    removeBaseMarker(markerId) {
        const baseData = this.baseMarkers.get(markerId);
        if (!baseData) {
            console.warn('⚠️ Base marker not found:', markerId);
            return;
        }
        
        console.log('🎨 Removing base marker:', markerId);
        
        // Remove zoom event listeners
        if (baseData.zoomHandler && baseData.marker && baseData.marker._map) {
            baseData.marker._map.off('zoomend', baseData.zoomHandler);
            baseData.marker._map.off('zoom', baseData.zoomHandler);
            baseData.marker._map.off('zoomstart', baseData.zoomHandler);
            console.log('🎨 Zoom event listeners removed for marker:', markerId);
        }
        
        // Remove marker from map
        if (baseData.marker && baseData.marker._map) {
            baseData.marker._map.removeLayer(baseData.marker);
        }
        
        // Cleanup animations
        this.animations.delete(markerId);
        this.particleSystems.delete(markerId);
        
        // Remove from storage
        this.baseMarkers.delete(markerId);
        
        console.log('🎨 Base marker removed successfully');
    }
    
    /**
     * BRDC: Get all active base markers
     * 
     * @returns {Map} - Map of active base markers
     */
    getAllBaseMarkers() {
        return this.baseMarkers;
    }
    
    /**
     * BRDC: Get base marker by ID
     * 
     * @param {string} markerId - Marker identifier
     * @returns {Object|null} - Base marker data or null
     */
    getBaseMarker(markerId) {
        return this.baseMarkers.get(markerId) || null;
    }
    
    /**
     * BRDC: Calculate zoom scale based on zoom level
     * 
     * @param {number} zoomLevel - Current zoom level
     * @returns {number} - Scale factor (0.1 to 1.0)
     */
    calculateZoomScale(zoomLevel) {
        const minZoom = 1, maxZoom = 18;
        const minScale = 0.1, maxScale = 1.0;
        
        if (zoomLevel <= minZoom) {
            return minScale;
        } else if (zoomLevel >= maxZoom) {
            return maxScale;
        } else {
            const zoomRange = maxZoom - minZoom;
            const scaleRange = maxScale - minScale;
            const zoomProgress = (zoomLevel - minZoom) / zoomRange;
            return minScale + (scaleRange * zoomProgress);
        }
    }
    
    /**
     * BRDC: Create scaled SVG content
     * 
     * This method properly scales SVG content by modifying the SVG attributes
     * and internal coordinates to match the desired size.
     * 
     * @param {string} originalSVG - Original SVG HTML string
     * @param {number} scale - Scale factor (0.1 to 1.0)
     * @param {number} newSize - New size in pixels
     * @returns {string} - Scaled SVG HTML string
     */
    createScaledSVG(originalSVG, scale, newSize) {
        // Parse the original SVG
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalSVG, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        
        if (!svg) {
            console.warn('⚠️ Could not parse SVG content');
            return originalSVG;
        }
        
        // Update SVG dimensions
        svg.setAttribute('width', newSize);
        svg.setAttribute('height', newSize);
        svg.setAttribute('viewBox', `0 0 ${newSize} ${newSize}`);
        
        // Scale all internal elements
        const scaleElements = (element) => {
            if (element.tagName === 'circle') {
                const cx = parseFloat(element.getAttribute('cx') || 0);
                const cy = parseFloat(element.getAttribute('cy') || 0);
                const r = parseFloat(element.getAttribute('r') || 0);
                
                element.setAttribute('cx', (cx * scale).toString());
                element.setAttribute('cy', (cy * scale).toString());
                element.setAttribute('r', (r * scale).toString());
            } else if (element.tagName === 'rect') {
                const x = parseFloat(element.getAttribute('x') || 0);
                const y = parseFloat(element.getAttribute('y') || 0);
                const width = parseFloat(element.getAttribute('width') || 0);
                const height = parseFloat(element.getAttribute('height') || 0);
                
                element.setAttribute('x', (x * scale).toString());
                element.setAttribute('y', (y * scale).toString());
                element.setAttribute('width', (width * scale).toString());
                element.setAttribute('height', (height * scale).toString());
            } else if (element.tagName === 'path') {
                // Scale path coordinates (simplified approach)
                const d = element.getAttribute('d') || '';
                const scaledD = d.replace(/(\d+(?:\.\d+)?)/g, (match) => {
                    return (parseFloat(match) * scale).toString();
                });
                element.setAttribute('d', scaledD);
            }
            
            // Recursively scale child elements
            Array.from(element.children).forEach(scaleElements);
        };
        
        // Scale all elements in the SVG
        Array.from(svg.children).forEach(scaleElements);
        
        // Return the scaled SVG as HTML string
        return new XMLSerializer().serializeToString(svg);
    }
    
    /**
     * BRDC: Test zoom event detection
     * 
     * This method adds a test zoom listener to see if zoom events are working
     */
    testZoomEvents() {
        if (this.baseMarkers.size === 0) {
            console.warn('⚠️ No base markers to test zoom events');
            return;
        }
        
        // Get the first base marker's map
        const firstBase = this.baseMarkers.values().next().value;
        if (!firstBase || !firstBase.marker || !firstBase.marker._map) {
            console.warn('⚠️ No valid base marker found for zoom testing');
            return;
        }
        
        const map = firstBase.marker._map;
        console.log('🔍 Testing zoom events on map...');
        
        const testZoomHandler = (e) => {
            console.log('🔍 ZOOM EVENT DETECTED:', e.type, 'Zoom level:', map.getZoom());
        };
        
        // Add test listeners
        map.on('zoomstart', testZoomHandler);
        map.on('zoom', testZoomHandler);
        map.on('zoomend', testZoomHandler);
        
        console.log('🔍 Test zoom listeners added. Try zooming the map to see if events are detected.');
        
        // Remove test listeners after 10 seconds
        setTimeout(() => {
            map.off('zoomstart', testZoomHandler);
            map.off('zoom', testZoomHandler);
            map.off('zoomend', testZoomHandler);
            console.log('🔍 Test zoom listeners removed');
        }, 10000);
    }
    
    /**
     * BRDC: Force scaling update for all existing bases
     * 
     * This method can be called to manually trigger scaling for all existing bases
     * based on the current map zoom level.
     */
    updateAllBaseScaling() {
        console.log('🔄 Updating scaling for all existing bases...');
        
        this.baseMarkers.forEach((baseData, markerId) => {
            if (baseData.marker && baseData.marker._map) {
                const currentZoom = baseData.marker._map.getZoom();
                console.log(`🔄 Updating base ${markerId} at zoom level ${currentZoom}`);
                
                const scale = this.calculateZoomScale(currentZoom);
                const newSize = Math.round(baseData.originalSize * scale);
                
                console.log(`🔄 Scaling base ${markerId} to ${newSize}px (scale: ${scale.toFixed(2)})`);
                
                // Create scaled SVG content
                const scaledSVG = this.createScaledSVG(baseData.originalSVG, scale, newSize);
                
                // Create new icon with scaled SVG content
                const newIcon = L.divIcon({
                    className: 'svg-base-marker',
                    html: scaledSVG,
                    iconSize: [newSize, newSize],
                    iconAnchor: [newSize / 2, newSize / 2]
                });
                
                // Update the marker
                baseData.marker.setIcon(newIcon);
                
                // Update stored data
                baseData.currentZoom = currentZoom;
                baseData.currentScale = scale;
            }
        });
        
        console.log('🔄 All base scaling updated successfully');
    }
    
    /**
     * BRDC: Manually test scaling for debugging
     * 
     * @param {string} markerId - Marker identifier
     * @param {number} zoomLevel - Zoom level to test
     */
    testScaling(markerId, zoomLevel) {
        const baseData = this.baseMarkers.get(markerId);
        if (!baseData) {
            console.warn('⚠️ Base marker not found for scaling test:', markerId);
            return;
        }
        
        console.log(`🧪 Manual scaling test for marker ${markerId} at zoom level ${zoomLevel}`);
        
        // Use the same scaling logic as the main scaling function
        const minZoom = 1, maxZoom = 18;
        const minScale = 0.1, maxScale = 1.0;
        
        let scale;
        if (zoomLevel <= minZoom) {
            scale = minScale;
        } else if (zoomLevel >= maxZoom) {
            scale = maxScale;
        } else {
            const zoomRange = maxZoom - minZoom;
            const scaleRange = maxScale - minScale;
            const zoomProgress = (zoomLevel - minZoom) / zoomRange;
            scale = minScale + (scaleRange * zoomProgress);
        }
        
        const newSize = Math.round(baseData.originalSize * scale);
        
        console.log(`🧪 Test scaling - Zoom: ${zoomLevel}, Scale: ${scale.toFixed(2)}, New Size: ${newSize}px`);
        
        // Create scaled SVG content
        const scaledSVG = this.createScaledSVG(baseData.originalSVG, scale, newSize);
        
        // Create new icon with scaled SVG content
        const newIcon = L.divIcon({
            className: 'svg-base-marker',
            html: scaledSVG,
            iconSize: [newSize, newSize],
            iconAnchor: [newSize / 2, newSize / 2]
        });
        
        // Update the marker
        baseData.marker.setIcon(newIcon);
        
        console.log(`🧪 Manual scaling applied successfully`);
    }
}

// CSS animations for SVG base graphics
const svgBaseStyles = `
@keyframes baseGlow {
    0% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)); }
    100% { filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.9)); }
}

@keyframes territoryPulse {
    0%, 100% { 
        transform: scale(1);
        opacity: 0.6;
    }
    50% { 
        transform: scale(1.1);
        opacity: 0.8;
    }
}

@keyframes energyRingRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes cosmicCorePulse {
    0%, 100% { 
        transform: scale(1);
        opacity: 0.9;
    }
    50% { 
        transform: scale(1.2);
        opacity: 1;
    }
}

@keyframes flagWave {
    0%, 100% { 
        transform: skewX(0deg);
    }
    50% { 
        transform: skewX(5deg);
    }
}

@keyframes particleFloat {
    0%, 100% { 
        transform: translateY(0px);
        opacity: 0.7;
    }
    50% { 
        transform: translateY(-10px);
        opacity: 1;
    }
}

.svg-base-marker {
    background: transparent !important;
    border: none !important;
}

.svg-base-container {
    pointer-events: none;
}
`;

// Inject CSS styles
const styleSheet = document.createElement('style');
styleSheet.textContent = svgBaseStyles;
document.head.appendChild(styleSheet);

// Export for global access
window.SVGBaseGraphics = SVGBaseGraphics;

console.log('🎨 SVG Base Graphics System loaded successfully');