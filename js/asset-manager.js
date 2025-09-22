/**
 * Asset Manager - Handles loading and caching of MP3 and SVG assets
 * Provides a unified interface for asset management across the game
 */

class AssetManager {
    constructor() {
        this.assets = new Map(); // assetId -> asset data
        this.loadingPromises = new Map(); // assetId -> loading promise
        this.basePath = './assets/';
        this.audioContext = null;
        this.audioBuffers = new Map(); // audioId -> AudioBuffer
        
        console.log('📦 Asset Manager initialized');
    }
    
    /**
     * Initialize the asset manager
     */
    async initialize() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 Audio context initialized');
            
            // Preload essential assets
            await this.preloadEssentialAssets();
            
            console.log('📦 Asset Manager ready');
        } catch (error) {
            console.warn('📦 Asset Manager initialization failed:', error);
        }
    }
    
    /**
     * Preload essential game assets
     */
    async preloadEssentialAssets() {
        const essentialAssets = [
            // Audio assets
            { id: 'ambient_hum', type: 'audio', path: 'audio/ambient_hum.mp3' },
            { id: 'step_sound', type: 'audio', path: 'audio/step_sound.mp3' },
            { id: 'quest_complete', type: 'audio', path: 'audio/quest_complete.mp3' },
            { id: 'combat_win', type: 'audio', path: 'audio/combat_win.mp3' },
            { id: 'combat_lose', type: 'audio', path: 'audio/combat_lose.mp3' },
            
            // SVG assets
            { id: 'player_marker', type: 'svg', path: 'svg/player_marker.svg' },
            { id: 'quest_marker', type: 'svg', path: 'svg/quest_marker.svg' },
            { id: 'npc_marker', type: 'svg', path: 'svg/npc_marker.svg' },
            { id: 'base_marker', type: 'svg', path: 'svg/base_marker.svg' },
            { id: 'flag_icon', type: 'svg', path: 'svg/flag_icon.svg' }
        ];
        
        console.log('📦 Preloading essential assets...');
        
        for (const asset of essentialAssets) {
            try {
                await this.loadAsset(asset.id, asset.type, asset.path);
            } catch (error) {
                console.warn(`📦 Failed to preload ${asset.id}:`, error);
            }
        }
        
        console.log('📦 Essential assets preloaded');
    }
    
    /**
     * Load a single asset
     */
    async loadAsset(assetId, type, path, options = {}) {
        // Return cached asset if available
        if (this.assets.has(assetId)) {
            return this.assets.get(assetId);
        }
        
        // Return existing loading promise if already loading
        if (this.loadingPromises.has(assetId)) {
            return this.loadingPromises.get(assetId);
        }
        
        const fullPath = this.basePath + path;
        const loadingPromise = this._loadAssetByType(assetId, type, fullPath, options);
        
        this.loadingPromises.set(assetId, loadingPromise);
        
        try {
            const asset = await loadingPromise;
            this.assets.set(assetId, asset);
            this.loadingPromises.delete(assetId);
            console.log(`📦 Loaded asset: ${assetId}`);
            return asset;
        } catch (error) {
            this.loadingPromises.delete(assetId);
            console.error(`📦 Failed to load asset ${assetId}:`, error);
            throw error;
        }
    }
    
    /**
     * Load asset by type
     */
    async _loadAssetByType(assetId, type, path, options) {
        switch (type) {
            case 'audio':
                return await this._loadAudioAsset(assetId, path, options);
            case 'svg':
                return await this._loadSVGAsset(assetId, path, options);
            case 'image':
                return await this._loadImageAsset(assetId, path, options);
            default:
                throw new Error(`Unknown asset type: ${type}`);
        }
    }
    
    /**
     * Load audio asset
     */
    async _loadAudioAsset(assetId, path, options) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.audioBuffers.set(assetId, audioBuffer);
            
            return {
                id: assetId,
                type: 'audio',
                path: path,
                buffer: audioBuffer,
                duration: audioBuffer.duration,
                sampleRate: audioBuffer.sampleRate
            };
        } catch (error) {
            console.warn(`📦 Audio asset ${assetId} not found, using fallback`);
            return this._createFallbackAudioAsset(assetId, options);
        }
    }
    
    /**
     * Load SVG asset
     */
    async _loadSVGAsset(assetId, path, options) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const svgText = await response.text();
            const svgElement = this._parseSVG(svgText, options);
            
            return {
                id: assetId,
                type: 'svg',
                path: path,
                element: svgElement,
                text: svgText
            };
        } catch (error) {
            console.warn(`📦 SVG asset ${assetId} not found, using fallback`);
            return this._createFallbackSVGAsset(assetId, options);
        }
    }
    
    /**
     * Load image asset
     */
    async _loadImageAsset(assetId, path, options) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    id: assetId,
                    type: 'image',
                    path: path,
                    element: img,
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = () => {
                console.warn(`📦 Image asset ${assetId} not found, using fallback`);
                resolve(this._createFallbackImageAsset(assetId, options));
            };
            img.src = path;
        });
    }
    
    /**
     * Parse SVG text into DOM element
     */
    _parseSVG(svgText, options = {}) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        
        if (!svgElement) {
            throw new Error('Invalid SVG format');
        }
        
        // Apply options
        if (options.width) svgElement.setAttribute('width', options.width);
        if (options.height) svgElement.setAttribute('height', options.height);
        if (options.class) svgElement.setAttribute('class', options.class);
        
        return svgElement;
    }
    
    /**
     * Create fallback audio asset using Web Audio API
     */
    _createFallbackAudioAsset(assetId, options = {}) {
        const duration = options.duration || 1.0;
        const frequency = options.frequency || 440;
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        
        const audioBuffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = audioBuffer.getChannelData(0);
        
        // Generate a simple tone
        for (let i = 0; i < length; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
        }
        
        this.audioBuffers.set(assetId, audioBuffer);
        
        return {
            id: assetId,
            type: 'audio',
            path: 'fallback',
            buffer: audioBuffer,
            duration: duration,
            sampleRate: sampleRate,
            isFallback: true
        };
    }
    
    /**
     * Create fallback SVG asset
     */
    _createFallbackSVGAsset(assetId, options = {}) {
        const width = options.width || 24;
        const height = options.height || 24;
        const color = options.color || '#666666';
        
        const svgText = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/2 - 2}" 
                        fill="${color}" stroke="#000" stroke-width="1"/>
                <text x="${width/2}" y="${height/2 + 4}" text-anchor="middle" 
                      font-family="Arial" font-size="10" fill="white">?</text>
            </svg>
        `;
        
        const svgElement = this._parseSVG(svgText, options);
        
        return {
            id: assetId,
            type: 'svg',
            path: 'fallback',
            element: svgElement,
            text: svgText,
            isFallback: true
        };
    }
    
    /**
     * Create fallback image asset
     */
    _createFallbackImageAsset(assetId, options = {}) {
        const width = options.width || 24;
        const height = options.height || 24;
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw a simple placeholder
        ctx.fillStyle = '#666666';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', width/2, height/2 + 4);
        
        return {
            id: assetId,
            type: 'image',
            path: 'fallback',
            element: canvas,
            width: width,
            height: height,
            isFallback: true
        };
    }
    
    /**
     * Get loaded asset
     */
    getAsset(assetId) {
        return this.assets.get(assetId);
    }
    
    /**
     * Check if asset is loaded
     */
    isAssetLoaded(assetId) {
        return this.assets.has(assetId);
    }
    
    /**
     * Play audio asset
     */
    playAudio(assetId, options = {}) {
        const audioBuffer = this.audioBuffers.get(assetId);
        if (!audioBuffer) {
            console.warn(`📦 Audio asset ${assetId} not found`);
            return null;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume || 1.0;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
        
        return source;
    }
    
    /**
     * Create Leaflet icon from SVG asset
     */
    createLeafletIcon(assetId, options = {}) {
        const svgAsset = this.getAsset(assetId);
        if (!svgAsset || svgAsset.type !== 'svg') {
            console.warn(`📦 SVG asset ${assetId} not found`);
            return null;
        }
        
        const size = options.size || [24, 24];
        const anchor = options.anchor || [12, 12];
        
        return L.divIcon({
            html: svgAsset.element.outerHTML,
            className: options.className || 'custom-icon',
            iconSize: size,
            iconAnchor: anchor
        });
    }
    
    /**
     * Preload multiple assets
     */
    async preloadAssets(assetList) {
        console.log(`📦 Preloading ${assetList.length} assets...`);
        
        const promises = assetList.map(asset => 
            this.loadAsset(asset.id, asset.type, asset.path, asset.options || {})
        );
        
        try {
            await Promise.all(promises);
            console.log('📦 All assets preloaded successfully');
        } catch (error) {
            console.warn('📦 Some assets failed to load:', error);
        }
    }
    
    /**
     * Get asset loading progress
     */
    getLoadingProgress() {
        const total = this.assets.size + this.loadingPromises.size;
        const loaded = this.assets.size;
        return total > 0 ? loaded / total : 1;
    }
    
    /**
     * Clear all assets from memory
     */
    clearAssets() {
        this.assets.clear();
        this.loadingPromises.clear();
        this.audioBuffers.clear();
        console.log('📦 All assets cleared from memory');
    }
}

// Export for global access
window.AssetManager = AssetManager;
