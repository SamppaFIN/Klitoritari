/**
 * WebGL Vector Graphics Renderer
 * Renders vector graphics (Finnish flags, boundaries) using WebGL
 */

class WebGLVectorRenderer {
    constructor(gl, canvas) {
        this.gl = gl;
        this.canvas = canvas;
        this.program = null;
        this.flagGenerator = new FinnishFlagGenerator();
        
        // WebGL state
        this.vertexBuffer = null;
        this.colorBuffer = null;
        this.vertexArray = [];
        this.colorArray = [];
        
        // Rendering state
        this.isInitialized = false;
        this.currentZoom = 1;
        this.mapCenter = { lat: 0, lng: 0 };
        this.mapBounds = null;
        
        // Check if WebGL context is valid before initializing
        if (this.gl && this.gl.VERTEX_SHADER) {
            this.init();
        } else {
            console.warn('🎨 WebGL context not available, skipping vector renderer initialization');
        }
    }

    init() {
        try {
            this.createShaderProgram();
            this.createBuffers();
            this.isInitialized = true;
            console.log('🎨 WebGL Vector Renderer initialized');
        } catch (error) {
            console.error('🎨 Failed to initialize WebGL Vector Renderer:', error);
        }
    }

    createShaderProgram() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec4 a_color;
            uniform mat4 u_projection;
            uniform mat4 u_view;
            uniform float u_zoom;
            
            varying vec4 v_color;
            
            void main() {
                gl_Position = u_projection * u_view * vec4(a_position, 0.0, 1.0);
                v_color = a_color;
                
                // Scale based on zoom level
                gl_PointSize = 8.0 / u_zoom;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            varying vec4 v_color;
            
            void main() {
                gl_FragColor = v_color;
            }
        `;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program: ' + this.gl.getProgramParameter(this.program, this.gl.INFO_LOG_LENGTH));
        }

        // Get attribute and uniform locations
        this.attribLocations = {
            position: this.gl.getAttribLocation(this.program, 'a_position'),
            color: this.gl.getAttribLocation(this.program, 'a_color')
        };

        this.uniformLocations = {
            projection: this.gl.getUniformLocation(this.program, 'u_projection'),
            view: this.gl.getUniformLocation(this.program, 'u_view'),
            zoom: this.gl.getUniformLocation(this.program, 'u_zoom')
        };
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error('Failed to compile shader: ' + error);
        }

        return shader;
    }

    createBuffers() {
        this.vertexBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
    }

    /**
     * Update map state for coordinate conversion
     */
    updateMapState(zoom, center, bounds) {
        this.currentZoom = zoom;
        this.mapCenter = center;
        this.mapBounds = bounds;
    }

    /**
     * Convert lat/lng to screen coordinates
     */
    latLngToScreen(lat, lng) {
        if (!this.mapBounds) {
            console.warn('🎨 No map bounds available for coordinate conversion');
            return { x: 0, y: 0 };
        }

        // Check if bounds are valid
        const west = this.mapBounds.getWest();
        const east = this.mapBounds.getEast();
        const north = this.mapBounds.getNorth();
        const south = this.mapBounds.getSouth();
        
        if (west === east || north === south) {
            console.warn('🎨 Invalid map bounds:', { west, east, north, south });
            return { x: 0, y: 0 };
        }

        const x = ((lng - west) / (east - west)) * 2 - 1;
        const y = ((lat - south) / (north - south)) * 2 - 1;
        
        // Clamp coordinates to prevent large overlays, but allow some range for off-screen elements
        const clampedX = Math.max(-5, Math.min(5, x));
        const clampedY = Math.max(-5, Math.min(5, y));
        
        // Only log if coordinates are significantly outside normal range
        if (Math.abs(x) > 3 || Math.abs(y) > 3) {
            console.warn('🎨 Coordinates outside normal range:', { lat, lng }, '->', { x, y }, 'clamped to:', { clampedX, clampedY });
        }
        
        return { x: clampedX, y: clampedY };
    }

    /**
     * Render Finnish flags along a path
     */
    renderFlagsAlongPath(pathPoints, flagSpacing = 15, scale = 1) {
        if (!this.isInitialized || pathPoints.length < 2) {
            console.log('🎨 Cannot render flags: initialized:', this.isInitialized, 'points:', pathPoints.length);
            return;
        }

        console.log('🎨 Generating flags for', pathPoints.length, 'path points');
        const flags = this.flagGenerator.generateFlagsAlongPath(pathPoints, flagSpacing, scale);
        console.log('🎨 Generated', flags.length, 'flags');
        this.renderFlags(flags);
    }

    /**
     * Render individual flags
     */
    renderFlags(flags) {
        if (!this.isInitialized || flags.length === 0) return;

        this.vertexArray = [];
        this.colorArray = [];

        flags.forEach(flag => {
            const screenPos = this.latLngToScreen(flag.lat, flag.lng);
            const webglData = this.flagGenerator.generateFlagWebGL(
                screenPos.x, 
                screenPos.y, 
                flag.scale, 
                flag.rotation
            );

            console.log('🎨 Rendering flag at:', screenPos, 'scale:', flag.scale, 'rotation:', flag.rotation);
            console.log('🎨 Background vertices:', webglData.background.vertices.length / 2, 'triangles');
            console.log('🎨 Horizontal cross vertices:', webglData.horizontalCross.vertices.length / 2, 'triangles');
            console.log('🎨 Vertical cross vertices:', webglData.verticalCross.vertices.length / 2, 'triangles');

            // Add background vertices first (renders behind) - only if there are vertices
            if (webglData.background.vertices.length > 0) {
                this.vertexArray.push(...webglData.background.vertices);
                for (let i = 0; i < webglData.background.vertices.length / 2; i++) {
                    this.colorArray.push(...webglData.background.color);
                }
            }

            // Add horizontal cross vertices (renders on top)
            this.vertexArray.push(...webglData.horizontalCross.vertices);
            for (let i = 0; i < webglData.horizontalCross.vertices.length / 2; i++) {
                this.colorArray.push(...webglData.horizontalCross.color);
            }

            // Add vertical cross vertices (renders on top)
            this.vertexArray.push(...webglData.verticalCross.vertices);
            for (let i = 0; i < webglData.verticalCross.vertices.length / 2; i++) {
                this.colorArray.push(...webglData.verticalCross.color);
            }
        });

        this.render();
    }

    /**
     * Render boundary polygon with flags
     */
    renderBoundaryWithFlags(boundaryPoints, flagSpacing = 15, scale = 1) {
        if (!this.isInitialized || boundaryPoints.length < 3) return;

        const boundaryData = this.flagGenerator.generateBoundaryWithFlags(boundaryPoints, flagSpacing, scale);
        this.renderFlags(boundaryData.flags);
        
        // Also render the boundary line
        this.renderBoundaryLine(boundaryPoints);
    }

    /**
     * Render boundary line - DISABLED to prevent large blue overlays
     */
    renderBoundaryLine(boundaryPoints) {
        // Disabled to prevent large blue cross overlays
        console.log('🎨 Boundary line rendering disabled to prevent large blue overlays');
        return;
    }

    /**
     * Render the accumulated vertices
     */
    render() {
        if (!this.isInitialized || this.vertexArray.length === 0) {
            console.log('🎨 Cannot render: initialized:', this.isInitialized, 'vertices:', this.vertexArray.length);
            return;
        }

        // Check if any coordinates are outside normal range (indicating invalid data)
        let hasInvalidCoordinates = false;
        for (let i = 0; i < this.vertexArray.length; i += 2) {
            if (Math.abs(this.vertexArray[i]) > 10 || Math.abs(this.vertexArray[i + 1]) > 10) {
                hasInvalidCoordinates = true;
                break;
            }
        }
        
        if (hasInvalidCoordinates) {
            console.warn('🎨 Skipping render due to invalid coordinates');
            return;
        }

        console.log('🎨 Rendering', this.vertexArray.length / 2, 'triangles with', this.colorArray.length / 4, 'colors');

        this.gl.useProgram(this.program);

        // Set up vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.attribLocations.position);
        this.gl.vertexAttribPointer(this.attribLocations.position, 2, this.gl.FLOAT, false, 0, 0);

        // Set up color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colorArray), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.attribLocations.color);
        this.gl.vertexAttribPointer(this.attribLocations.color, 4, this.gl.FLOAT, false, 0, 0);

        // Set uniforms
        this.gl.uniformMatrix4fv(this.uniformLocations.projection, false, this.createProjectionMatrix());
        this.gl.uniformMatrix4fv(this.uniformLocations.view, false, this.createViewMatrix());
        this.gl.uniform1f(this.uniformLocations.zoom, this.currentZoom);

        // Enable blending for transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexArray.length / 2);

        // Disable blending
        this.gl.disable(this.gl.BLEND);
        
        console.log('🎨 Render complete');
    }

    createProjectionMatrix() {
        // Simple orthographic projection
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    createViewMatrix() {
        // Identity matrix for now
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Clear all rendered content
     */
    clear() {
        this.vertexArray = [];
        this.colorArray = [];
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.vertexBuffer) {
            this.gl.deleteBuffer(this.vertexBuffer);
        }
        if (this.colorBuffer) {
            this.gl.deleteBuffer(this.colorBuffer);
        }
        if (this.program) {
            this.gl.deleteProgram(this.program);
        }
    }
}

// Make it globally available
window.WebGLVectorRenderer = WebGLVectorRenderer;
