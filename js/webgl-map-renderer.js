/**
 * WebGL Map Object Renderer
 * High-performance GPU-based rendering for map objects with LOD support
 * Based on single Float32Array architecture for maximum performance
 */

class WebGLMapRenderer {
    constructor() {
        this.gl = null;
        this.canvas = null;
        this.program = null;
        this.buffer = null;
        this.objectData = null;
        this.maxObjects = 10000; // Maximum objects supported
        this.objectStride = 16; // 16 floats per object (64 bytes)
        this.currentZoom = 15;
        this.mapBounds = null;
        // Initialize matrices with fallback if GLMatrix not available
        if (typeof mat4 !== 'undefined') {
            this.projectionMatrix = mat4.create();
            this.viewMatrix = mat4.create();
        } else {
            // Fallback identity matrices
            this.projectionMatrix = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            this.viewMatrix = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
        
        // Object data structure (16 floats per object):
        // [0-1]   position (x, y) - normalized coordinates
        // [2-3]   minZoom, maxZoom - zoom level visibility range
        // [4-7]   lodData1-4 - LOD-specific data (size, color, etc.)
        // [8-11]  lodData5-8 - Additional LOD data
        // [12-15] objectType, flags, animation, reserved - metadata
        
        this.objectTypes = {
            PLAYER: 1,
            INVESTIGATION: 2,
            QUEST: 3,
            MONSTER: 4,
            POI: 5,
            BASE: 6,
            LEGENDARY: 7
        };
        
        this.init();
    }
    
    init() {
        this.setupWebGLCanvas();
        this.setupShaders();
        this.setupBuffers();
        this.setupObjectData();
        console.log('🌌 WebGL Map Renderer initialized');
    }
    
    setupWebGLCanvas() {
        // Create WebGL canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'webgl-map-overlay';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 500;
        `;
        
        // Insert after map container
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.appendChild(this.canvas);
        }
        
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        if (!this.gl) {
            console.error('🌌 WebGL not supported');
            return;
        }
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_minZoom;
            attribute float a_maxZoom;
            attribute vec4 a_lodData1;
            attribute vec4 a_lodData2;
            attribute vec4 a_lodData3;
            attribute vec4 a_lodData4;
            attribute float a_objectType;
            attribute float a_flags;
            attribute float a_animation;
            attribute float a_reserved;
            
            uniform float u_zoomLevel;
            uniform mat4 u_projectionMatrix;
            uniform mat4 u_viewMatrix;
            uniform vec2 u_mapCenter;
            uniform vec2 u_mapSize;
            
            varying vec4 v_lodData1;
            varying vec4 v_lodData2;
            varying vec4 v_lodData3;
            varying vec4 v_lodData4;
            varying float v_objectType;
            varying float v_zoomFactor;
            varying float v_visibility;
            
            // LOD calculation based on zoom level
            float calculateLOD(float minZoom, float maxZoom, float currentZoom) {
                if (currentZoom < minZoom || currentZoom > maxZoom) {
                    return 0.0; // Not visible
                }
                
                float zoomRange = maxZoom - minZoom;
                float zoomProgress = (currentZoom - minZoom) / zoomRange;
                
                // Smooth LOD transition
                return smoothstep(0.0, 1.0, zoomProgress);
            }
            
            void main() {
                // Calculate zoom-based visibility
                float visibility = calculateLOD(a_minZoom, a_maxZoom, u_zoomLevel);
                
                // Move off-screen if not visible
                if (visibility < 0.01) {
                    gl_Position = vec4(2.0, 2.0, 0.0, 1.0); // Off-screen
                    v_visibility = 0.0;
                } else {
                    // Convert map coordinates to screen coordinates
                    vec2 screenPos = (a_position - u_mapCenter) / u_mapSize * 2.0;
                    
                    // Apply view and projection matrices
                    vec4 worldPos = vec4(screenPos, 0.0, 1.0);
                    gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
                    
                    // Calculate point size based on LOD and zoom
                    float baseSize = a_lodData1.x; // Base size from LOD data
                    float zoomFactor = pow(2.0, u_zoomLevel - 15.0); // Zoom scaling
                    gl_PointSize = baseSize * zoomFactor * visibility;
                    
                    v_visibility = visibility;
                }
                
                // Pass data to fragment shader
                v_lodData1 = a_lodData1;
                v_lodData2 = a_lodData2;
                v_lodData3 = a_lodData3;
                v_lodData4 = a_lodData4;
                v_objectType = a_objectType;
                v_zoomFactor = pow(2.0, u_zoomLevel - 15.0);
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec4 v_lodData1;
            varying vec4 v_lodData2;
            varying vec4 v_lodData3;
            varying vec4 v_lodData4;
            varying float v_objectType;
            varying float v_zoomFactor;
            varying float v_visibility;
            
            uniform float u_zoomLevel;
            uniform float u_time;
            
            // Color palettes for different object types
            vec3 getObjectColor(float objectType, vec4 lodData) {
                if (objectType < 1.5) { // PLAYER
                    return vec3(0.0, 1.0, 0.0); // Green
                } else if (objectType < 2.5) { // INVESTIGATION
                    return vec3(0.4, 0.0, 0.8); // Purple
                } else if (objectType < 3.5) { // QUEST
                    return vec3(0.0, 1.0, 0.5); // Cyan
                } else if (objectType < 4.5) { // MONSTER
                    return vec3(1.0, 0.0, 0.0); // Red
                } else if (objectType < 5.5) { // POI
                    return vec3(0.0, 0.5, 1.0); // Blue
                } else if (objectType < 6.5) { // BASE
                    return vec3(1.0, 0.0, 0.0); // Red
                } else if (objectType < 7.5) { // LEGENDARY
                    return vec3(1.0, 0.3, 0.0); // Orange
                }
                return vec3(0.5, 0.5, 0.5); // Default gray
            }
            
            // Generate cosmic effects
            vec3 generateCosmicEffect(vec2 coord, float objectType, float time) {
                vec2 center = coord - 0.5;
                float dist = length(center);
                
                // Pulsing effect
                float pulse = sin(time * 2.0 + dist * 10.0) * 0.1 + 0.9;
                
                // Glow effect
                float glow = exp(-dist * 8.0) * pulse;
                
                // Color variation
                vec3 baseColor = getObjectColor(objectType, v_lodData1);
                vec3 glowColor = baseColor * glow;
                
                return glowColor;
            }
            
            void main() {
                if (v_visibility < 0.01) {
                    discard;
                }
                
                // Calculate fragment position within point
                vec2 coord = gl_PointCoord;
                
                // Create circular shape
                vec2 center = coord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) {
                    discard;
                }
                
                // Generate cosmic effects
                vec3 color = generateCosmicEffect(coord, v_objectType, u_time);
                
                // Apply zoom-based alpha
                float alpha = v_visibility * (1.0 - dist * 2.0);
                
                gl_FragColor = vec4(color, alpha);
            }
        `;
        
        // Compile shaders
        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        
        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('🌌 Shader program linking failed:', this.gl.getProgramInfoLog(this.program));
        }
        
        // Get attribute and uniform locations
        this.setupShaderLocations();
    }
    
    setupShaderLocations() {
        this.attribLocations = {
            position: this.gl.getAttribLocation(this.program, 'a_position'),
            minZoom: this.gl.getAttribLocation(this.program, 'a_minZoom'),
            maxZoom: this.gl.getAttribLocation(this.program, 'a_maxZoom'),
            lodData1: this.gl.getAttribLocation(this.program, 'a_lodData1'),
            lodData2: this.gl.getAttribLocation(this.program, 'a_lodData2'),
            lodData3: this.gl.getAttribLocation(this.program, 'a_lodData3'),
            lodData4: this.gl.getAttribLocation(this.program, 'a_lodData4'),
            objectType: this.gl.getAttribLocation(this.program, 'a_objectType'),
            flags: this.gl.getAttribLocation(this.program, 'a_flags'),
            animation: this.gl.getAttribLocation(this.program, 'a_animation'),
            reserved: this.gl.getAttribLocation(this.program, 'a_reserved')
        };
        
        // Check for invalid attribute locations and disable WebGL if needed
        const invalidAttribs = Object.entries(this.attribLocations).filter(([name, location]) => location === -1);
        if (invalidAttribs.length > 0) {
            console.warn('🌌 Invalid attribute locations detected:', invalidAttribs);
            this.isEnabled = false;
            return;
        }
        
        this.uniformLocations = {
            zoomLevel: this.gl.getUniformLocation(this.program, 'u_zoomLevel'),
            projectionMatrix: this.gl.getUniformLocation(this.program, 'u_projectionMatrix'),
            viewMatrix: this.gl.getUniformLocation(this.program, 'u_viewMatrix'),
            mapCenter: this.gl.getUniformLocation(this.program, 'u_mapCenter'),
            mapSize: this.gl.getUniformLocation(this.program, 'u_mapSize'),
            time: this.gl.getUniformLocation(this.program, 'u_time')
        };
    }
    
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('🌌 Shader compilation failed:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    setupBuffers() {
        // Create buffer for object data
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        
        // Allocate buffer space
        const bufferSize = this.maxObjects * this.objectStride * 4; // 4 bytes per float
        this.gl.bufferData(this.gl.ARRAY_BUFFER, bufferSize, this.gl.DYNAMIC_DRAW);
    }
    
    setupObjectData() {
        // Initialize Float32Array for object data
        this.objectData = new Float32Array(this.maxObjects * this.objectStride);
        this.objectCount = 0;
    }
    
    // Add object to the render queue
    addObject(object) {
        if (this.objectCount >= this.maxObjects) {
            console.warn('🌌 Maximum object count reached');
            return false;
        }
        
        const index = this.objectCount * this.objectStride;
        
        // Position (normalized coordinates)
        this.objectData[index] = object.x || 0;
        this.objectData[index + 1] = object.y || 0;
        
        // Zoom range
        this.objectData[index + 2] = object.minZoom || 10;
        this.objectData[index + 3] = object.maxZoom || 20;
        
        // LOD data
        this.objectData[index + 4] = object.size || 20; // Base size
        this.objectData[index + 5] = object.colorR || 1.0;
        this.objectData[index + 6] = object.colorG || 1.0;
        this.objectData[index + 7] = object.colorB || 1.0;
        
        // Additional LOD data
        this.objectData[index + 8] = object.animationSpeed || 1.0;
        this.objectData[index + 9] = object.glowIntensity || 0.5;
        this.objectData[index + 10] = object.pulseSpeed || 1.0;
        this.objectData[index + 11] = object.rotationSpeed || 0.0;
        
        // Metadata
        this.objectData[index + 12] = object.type || this.objectTypes.POI;
        this.objectData[index + 13] = object.flags || 0;
        this.objectData[index + 14] = object.animation || 0;
        this.objectData[index + 15] = 0; // Reserved
        
        this.objectCount++;
        return true;
    }
    
    // Update object data
    updateObject(index, object) {
        if (index >= this.objectCount) return false;
        
        const dataIndex = index * this.objectStride;
        
        // Update position
        if (object.x !== undefined) this.objectData[dataIndex] = object.x;
        if (object.y !== undefined) this.objectData[dataIndex + 1] = object.y;
        
        // Update other properties as needed
        if (object.size !== undefined) this.objectData[dataIndex + 4] = object.size;
        if (object.colorR !== undefined) this.objectData[dataIndex + 5] = object.colorR;
        if (object.colorG !== undefined) this.objectData[dataIndex + 6] = object.colorG;
        if (object.colorB !== undefined) this.objectData[dataIndex + 7] = object.colorB;
        
        return true;
    }
    
    // Remove object
    removeObject(index) {
        if (index >= this.objectCount) return false;
        
        // Move last object to this position
        const lastIndex = this.objectCount - 1;
        if (index !== lastIndex) {
            for (let i = 0; i < this.objectStride; i++) {
                this.objectData[index * this.objectStride + i] = this.objectData[lastIndex * this.objectStride + i];
            }
        }
        
        this.objectCount--;
        return true;
    }
    
    // Update map state
    updateMapState(zoom, center, bounds) {
        this.currentZoom = zoom;
        this.mapCenter = center;
        this.mapBounds = bounds;
        
        // Update projection matrix
        if (typeof mat4 !== 'undefined') {
            mat4.ortho(this.projectionMatrix, -1, 1, -1, 1, -1, 1);
            mat4.identity(this.viewMatrix);
        } else {
            // Fallback: keep identity matrices
            // In a real implementation, you'd calculate ortho projection manually
        }
    }
    
    // Render all objects
    render() {
        if (!this.gl || !this.program || this.objectCount === 0) return;
        
        this.gl.useProgram(this.program);
        
        // Update buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.objectData.subarray(0, this.objectCount * this.objectStride));
        
        // Set up attributes
        this.setupAttributes();
        
        // Set uniforms
        this.setupUniforms();
        
        // Enable blending for transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Render points
        this.gl.drawArrays(this.gl.POINTS, 0, this.objectCount);
        
        this.gl.disable(this.gl.BLEND);
    }
    
    setupAttributes() {
        if (!this.isEnabled) return;
        
        const stride = this.objectStride * 4; // 4 bytes per float
        
        // Safely enable vertex attributes with error checking
        const enableAttribute = (location, size, offset) => {
            if (location >= 0) {
                this.gl.enableVertexAttribArray(location);
                this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, offset);
            }
        };
        
        // Position
        enableAttribute(this.attribLocations.position, 2, 0);
        
        // Min/Max zoom
        enableAttribute(this.attribLocations.minZoom, 1, 8);
        enableAttribute(this.attribLocations.maxZoom, 1, 12);
        
        // LOD data
        enableAttribute(this.attribLocations.lodData1, 4, 16);
        enableAttribute(this.attribLocations.lodData2, 4, 32);
        enableAttribute(this.attribLocations.lodData3, 4, 48);
        enableAttribute(this.attribLocations.lodData4, 4, 64);
        
        // Metadata
        enableAttribute(this.attribLocations.objectType, 1, 80);
        enableAttribute(this.attribLocations.flags, 1, 84);
        enableAttribute(this.attribLocations.animation, 1, 88);
        enableAttribute(this.attribLocations.reserved, 1, 92);
    }
    
    setupUniforms() {
        // Zoom level
        this.gl.uniform1f(this.uniformLocations.zoomLevel, this.currentZoom);
        
        // Matrices
        this.gl.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.uniformLocations.viewMatrix, false, this.viewMatrix);
        
        // Map state
        if (this.mapCenter) {
            this.gl.uniform2f(this.uniformLocations.mapCenter, this.mapCenter.x, this.mapCenter.y);
        }
        
        if (this.mapBounds) {
            const mapSize = {
                x: this.mapBounds.max.x - this.mapBounds.min.x,
                y: this.mapBounds.max.y - this.mapBounds.min.y
            };
            this.gl.uniform2f(this.uniformLocations.mapSize, mapSize.x, mapSize.y);
        }
        
        // Time for animations
        this.gl.uniform1f(this.uniformLocations.time, performance.now() * 0.001);
    }
    
    // Clear all objects
    clear() {
        this.objectCount = 0;
    }
    
    // Get object count
    getObjectCount() {
        return this.objectCount;
    }
    
    // Destroy renderer
    destroy() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }
        if (this.program) {
            this.gl.deleteProgram(this.program);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Export for use in other modules
window.WebGLMapRenderer = WebGLMapRenderer;
