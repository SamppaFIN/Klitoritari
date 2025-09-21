// Vertex Shader for WebGL Map Object Rendering
// Handles zoom-based culling and LOD transitions

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
uniform float u_time;

varying vec4 v_lodData1;
varying vec4 v_lodData2;
varying vec4 v_lodData3;
varying vec4 v_lodData4;
varying float v_objectType;
varying float v_zoomFactor;
varying float v_visibility;
varying float v_animationPhase;

// Smooth LOD calculation based on zoom level
float calculateLOD(float minZoom, float maxZoom, float currentZoom) {
    if (currentZoom < minZoom || currentZoom > maxZoom) {
        return 0.0; // Not visible
    }
    
    float zoomRange = maxZoom - minZoom;
    float zoomProgress = (currentZoom - minZoom) / zoomRange;
    
    // Smooth LOD transition with easing
    return smoothstep(0.0, 1.0, zoomProgress);
}

// Calculate object size based on zoom and LOD
float calculateObjectSize(float baseSize, float zoomLevel, float lodFactor) {
    // Exponential scaling with zoom
    float zoomFactor = pow(2.0, zoomLevel - 15.0);
    
    // Apply LOD scaling
    float lodSize = baseSize * lodFactor;
    
    // Minimum size to prevent objects from becoming invisible
    return max(lodSize * zoomFactor, 2.0);
}

// Calculate animation phase for various effects
float calculateAnimationPhase(float animationType, float animationSpeed, float time) {
    float phase = time * animationSpeed;
    
    if (animationType < 0.5) {
        // No animation
        return 0.0;
    } else if (animationType < 1.5) {
        // Pulsing
        return sin(phase) * 0.5 + 0.5;
    } else if (animationType < 2.5) {
        // Rotating
        return mod(phase, 6.28318);
    } else if (animationType < 3.5) {
        // Breathing
        return sin(phase * 0.5) * 0.3 + 0.7;
    } else if (animationType < 4.5) {
        // Energy field
        return sin(phase * 2.0) * 0.4 + 0.6;
    }
    
    return 0.0;
}

void main() {
    // Calculate zoom-based visibility
    float visibility = calculateLOD(a_minZoom, a_maxZoom, u_zoomLevel);
    
    // Move off-screen if not visible
    if (visibility < 0.01) {
        gl_Position = vec4(2.0, 2.0, 0.0, 1.0); // Off-screen
        v_visibility = 0.0;
        v_animationPhase = 0.0;
    } else {
        // Convert map coordinates to screen coordinates
        vec2 screenPos = (a_position - u_mapCenter) / u_mapSize * 2.0;
        
        // Apply view and projection matrices
        vec4 worldPos = vec4(screenPos, 0.0, 1.0);
        gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
        
        // Calculate object size with LOD and zoom
        float baseSize = a_lodData1.x;
        float objectSize = calculateObjectSize(baseSize, u_zoomLevel, visibility);
        
        // Apply animation effects to size
        float animationPhase = calculateAnimationPhase(a_animation, a_lodData2.x, u_time);
        float animatedSize = objectSize * (1.0 + animationPhase * 0.2);
        
        gl_PointSize = animatedSize;
        
        v_visibility = visibility;
        v_animationPhase = animationPhase;
    }
    
    // Pass data to fragment shader
    v_lodData1 = a_lodData1;
    v_lodData2 = a_lodData2;
    v_lodData3 = a_lodData3;
    v_lodData4 = a_lodData4;
    v_objectType = a_objectType;
    v_zoomFactor = pow(2.0, u_zoomLevel - 15.0);
}
