// Fragment Shader for WebGL Map Object Rendering
// Handles cosmic effects, colors, and transparency

precision mediump float;

varying vec4 v_lodData1;
varying vec4 v_lodData2;
varying vec4 v_lodData3;
varying vec4 v_lodData4;
varying float v_objectType;
varying float v_zoomFactor;
varying float v_visibility;
varying float v_animationPhase;

uniform float u_zoomLevel;
uniform float u_time;

// Color palettes for different object types
vec3 getObjectColor(float objectType, vec4 lodData) {
    if (objectType < 1.5) { // PLAYER
        return vec3(0.0, 1.0, 0.0); // Bright green
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

// Generate cosmic glow effect
vec3 generateCosmicGlow(vec2 coord, float objectType, float time, float glowIntensity) {
    vec2 center = coord - 0.5;
    float dist = length(center);
    
    // Pulsing effect
    float pulse = sin(time * 2.0 + dist * 10.0) * 0.1 + 0.9;
    
    // Glow falloff
    float glow = exp(-dist * 8.0) * pulse * glowIntensity;
    
    // Color variation based on object type
    vec3 baseColor = getObjectColor(objectType, v_lodData1);
    
    // Add cosmic shimmer
    float shimmer = sin(time * 3.0 + dist * 20.0) * 0.1 + 0.9;
    vec3 shimmerColor = baseColor * shimmer;
    
    return shimmerColor * glow;
}

// Generate energy field effect
vec3 generateEnergyField(vec2 coord, float time, float intensity) {
    vec2 center = coord - 0.5;
    float dist = length(center);
    
    // Concentric energy rings
    float ring1 = sin(dist * 20.0 - time * 5.0) * 0.3 + 0.7;
    float ring2 = sin(dist * 30.0 + time * 3.0) * 0.2 + 0.8;
    
    // Combine rings
    float energy = (ring1 + ring2) * 0.5;
    
    // Apply intensity
    return vec3(energy * intensity);
}

// Generate particle effect
vec3 generateParticles(vec2 coord, float time, float density) {
    vec2 center = coord - 0.5;
    
    // Create particle grid
    vec2 grid = fract(center * 10.0);
    float particle = step(0.9, grid.x) * step(0.9, grid.y);
    
    // Animate particles
    float animation = sin(time * 2.0 + grid.x * 10.0 + grid.y * 10.0) * 0.5 + 0.5;
    
    return vec3(particle * animation * density);
}

// Generate cosmic distortion
vec2 generateDistortion(vec2 coord, float time, float intensity) {
    vec2 center = coord - 0.5;
    float dist = length(center);
    
    // Create swirling distortion
    float angle = atan(center.y, center.x) + time * 0.5;
    float radius = dist + sin(angle * 3.0) * 0.1 * intensity;
    
    vec2 distorted = vec2(cos(angle), sin(angle)) * radius + 0.5;
    
    return distorted;
}

// Main fragment shader
void main() {
    if (v_visibility < 0.01) {
        discard;
    }
    
    // Calculate fragment position within point
    vec2 coord = gl_PointCoord;
    
    // Apply cosmic distortion
    vec2 distortedCoord = generateDistortion(coord, u_time, v_animationPhase * 0.3);
    
    // Create circular shape
    vec2 center = distortedCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) {
        discard;
    }
    
    // Get base color
    vec3 baseColor = getObjectColor(v_objectType, v_lodData1);
    
    // Generate cosmic effects
    float glowIntensity = v_lodData2.y; // Glow intensity from LOD data
    vec3 glowColor = generateCosmicGlow(distortedCoord, v_objectType, u_time, glowIntensity);
    
    // Add energy field for certain object types
    vec3 energyColor = vec3(0.0);
    if (v_objectType > 6.5) { // LEGENDARY objects
        energyColor = generateEnergyField(distortedCoord, u_time, 0.5);
    }
    
    // Add particle effects for quest objects
    vec3 particleColor = vec3(0.0);
    if (v_objectType > 2.5 && v_objectType < 3.5) { // QUEST objects
        particleColor = generateParticles(distortedCoord, u_time, 0.3);
    }
    
    // Combine all effects
    vec3 finalColor = baseColor + glowColor + energyColor + particleColor;
    
    // Apply zoom-based alpha
    float alpha = v_visibility * (1.0 - dist * 2.0);
    
    // Add animation-based alpha variation
    alpha *= (0.8 + v_animationPhase * 0.4);
    
    // Apply cosmic shimmer to alpha
    float shimmer = sin(u_time * 4.0 + dist * 15.0) * 0.1 + 0.9;
    alpha *= shimmer;
    
    gl_FragColor = vec4(finalColor, alpha);
}
