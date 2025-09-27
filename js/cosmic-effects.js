/**
 * Cosmic Effects - Three.js WebGL particle system for atmospheric effects
 * Creates immersive cosmic background with particles and energy waves
 */

class CosmicEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.energyWaves = [];
        this.animationId = null;
        this.isInitialized = false;
    }

    init() {
        const canvas = document.getElementById('cosmic-canvas');
        if (!canvas) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create particle system
        this.createParticleSystem();
        
        // Create energy waves
        this.createEnergyWaves();

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Integrate with enhanced cosmic effects
        this.integrateWithEnhancedEffects();

        this.isInitialized = true;
        console.log('Œ Cosmic effects initialized with enhanced integration');
    }
    
    integrateWithEnhancedEffects() {
        // Wait for enhanced cosmic effects to be available
        setTimeout(() => {
            if (window.enhancedCosmicEffects) {
                console.log('¨ Integrating with Enhanced Cosmic Effects');
                
                // Add cosmic energy bursts on user interactions
                this.setupInteractionEffects();
                
                // Add cosmic energy waves on panel changes
                this.setupPanelChangeEffects();
            }
        }, 1000);
    }
    
    setupInteractionEffects() {
        // Add cosmic energy bursts on tab button clicks
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.createEnergyBurst();
            });
        });
        
        // Add cosmic energy waves on inventory item interactions
        const inventoryItems = document.querySelectorAll('.inventory-item-card');
        inventoryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.createEnergyWave();
            });
        });
    }
    
    setupPanelChangeEffects() {
        // Monitor for panel changes and create cosmic effects
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach(panel => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (panel.classList.contains('active')) {
                            this.createPanelActivationEffect();
                        }
                    }
                });
            });
            
            observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
        });
    }
    
    createEnergyBurst() {
        // Create a burst of energy particles
        const burstGeometry = new THREE.BufferGeometry();
        const burstCount = 50;
        const positions = new Float32Array(burstCount * 3);
        const colors = new Float32Array(burstCount * 3);
        const sizes = new Float32Array(burstCount);
        
        for (let i = 0; i < burstCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = (Math.random() - 0.5) * 2;
            
            colors[i3] = 0.3 + Math.random() * 0.4; // Blue
            colors[i3 + 1] = 0.6 + Math.random() * 0.4; // Green
            colors[i3 + 2] = 1.0; // Full blue
            
            sizes[i] = Math.random() * 0.5 + 0.1;
        }
        
        burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        burstGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        burstGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const burstMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 2.0) * 0.3);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - distance * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const burstParticles = new THREE.Points(burstGeometry, burstMaterial);
        this.scene.add(burstParticles);
        
        // Animate and remove burst
        let burstTime = 0;
        const animateBurst = () => {
            burstTime += 0.016;
            burstMaterial.uniforms.time.value = burstTime;
            
            if (burstTime > 2.0) {
                this.scene.remove(burstParticles);
                burstGeometry.dispose();
                burstMaterial.dispose();
                return;
            }
            
            requestAnimationFrame(animateBurst);
        };
        
        animateBurst();
    }
    
    createEnergyWave() {
        // Create a wave of energy particles
        const waveGeometry = new THREE.BufferGeometry();
        const waveCount = 30;
        const positions = new Float32Array(waveCount * 3);
        const colors = new Float32Array(waveCount * 3);
        const sizes = new Float32Array(waveCount);
        
        for (let i = 0; i < waveCount; i++) {
            const i3 = i * 3;
            const angle = (i / waveCount) * Math.PI * 2;
            const radius = 1.5;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = 0;
            
            colors[i3] = 0.2 + Math.random() * 0.3; // Blue
            colors[i3 + 1] = 0.8 + Math.random() * 0.2; // Green
            colors[i3 + 2] = 1.0; // Full blue
            
            sizes[i] = Math.random() * 0.3 + 0.2;
        }
        
        waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        waveGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 3.0) * 0.5);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - distance * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const waveParticles = new THREE.Points(waveGeometry, waveMaterial);
        this.scene.add(waveParticles);
        
        // Animate and remove wave
        let waveTime = 0;
        const animateWave = () => {
            waveTime += 0.016;
            waveMaterial.uniforms.time.value = waveTime;
            
            if (waveTime > 3.0) {
                this.scene.remove(waveParticles);
                waveGeometry.dispose();
                waveMaterial.dispose();
                return;
            }
            
            requestAnimationFrame(animateWave);
        };
        
        animateWave();
    }
    
    createPanelActivationEffect() {
        // Create a cosmic panel activation effect
        const activationGeometry = new THREE.BufferGeometry();
        const activationCount = 20;
        const positions = new Float32Array(activationCount * 3);
        const colors = new Float32Array(activationCount * 3);
        const sizes = new Float32Array(activationCount);
        
        for (let i = 0; i < activationCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 4;
            positions[i3 + 1] = (Math.random() - 0.5) * 4;
            positions[i3 + 2] = (Math.random() - 0.5) * 4;
            
            colors[i3] = 0.4 + Math.random() * 0.3; // Blue
            colors[i3 + 1] = 0.7 + Math.random() * 0.3; // Green
            colors[i3 + 2] = 1.0; // Full blue
            
            sizes[i] = Math.random() * 0.4 + 0.2;
        }
        
        activationGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        activationGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        activationGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const activationMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 4.0) * 0.4);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - distance * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const activationParticles = new THREE.Points(activationGeometry, activationMaterial);
        this.scene.add(activationParticles);
        
        // Animate and remove activation effect
        let activationTime = 0;
        const animateActivation = () => {
            activationTime += 0.016;
            activationMaterial.uniforms.time.value = activationTime;
            
            if (activationTime > 2.5) {
                this.scene.remove(activationParticles);
                activationGeometry.dispose();
                activationMaterial.dispose();
                return;
            }
            
            requestAnimationFrame(animateActivation);
        };
        
        animateActivation();
    }

    createParticleSystem() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Cosmic color palette
        const cosmicColors = [
            new THREE.Color(0x6a0dad), // Purple
            new THREE.Color(0x00ff88), // Green
            new THREE.Color(0xff0040), // Red
            new THREE.Color(0x0080ff), // Blue
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a large sphere
            const radius = 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random cosmic colors
            const color = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Simplified material for cosmic particles
        const material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createEnergyWaves() {
        // Create multiple energy wave rings
        for (let i = 0; i < 5; i++) {
            const wave = this.createEnergyWave(i);
            this.energyWaves.push(wave);
            this.scene.add(wave.mesh); // Fix: add the mesh, not the wave object
        }
    }

    createEnergyWave(index) {
        const geometry = new THREE.RingGeometry(20 + index * 15, 25 + index * 15, 32);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.7 + index * 0.1, 0.8, 0.5),
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });

        const wave = new THREE.Mesh(geometry, material);
        wave.rotation.x = Math.PI / 2;
        wave.position.z = -50 - index * 20;
        
        return {
            mesh: wave,
            speed: 0.5 + index * 0.2,
            scale: 1.0,
            direction: 1
        };
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isInitialized) return;

        const time = Date.now() * 0.001;

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            // Simple pulsing effect
            this.particles.material.opacity = 0.3 + Math.sin(time * 2) * 0.3;
        }

        // Animate energy waves
        this.energyWaves.forEach((wave, index) => {
            wave.mesh.rotation.z += wave.speed * 0.01;
            wave.mesh.scale.setScalar(wave.scale);
            
            // Pulsing effect
            wave.scale += Math.sin(time * 2 + index) * 0.002;
            wave.scale = Math.max(0.8, Math.min(1.2, wave.scale));
            
            // Move waves
            wave.mesh.position.z += wave.direction * 0.5;
            if (wave.mesh.position.z > 50) {
                wave.mesh.position.z = -200;
            }
        });

        // Check if WebGL context is still valid before rendering
        if (this.renderer && this.renderer.getContext() && !this.renderer.getContext().isContextLost()) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.isInitialized) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Add cosmic energy burst effect
    createEnergyBurst(x, y, intensity = 1.0) {
        const burstGeometry = new THREE.RingGeometry(0, 50 * intensity, 32);
        const burstMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const burst = new THREE.Mesh(burstGeometry, burstMaterial);
        burst.position.set(x, y, -100);
        burst.rotation.x = Math.PI / 2;
        
        this.scene.add(burst);

        // Animate burst
        const animateBurst = () => {
            burst.scale.multiplyScalar(1.1);
            burst.material.opacity *= 0.95;
            
            if (burst.material.opacity > 0.01) {
                requestAnimationFrame(animateBurst);
            } else {
                this.scene.remove(burst);
            }
        };
        
        animateBurst();
    }

    createEnergyWave(intensity = 1.0) {
        const wave = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: 0,
            maxRadius: 200 + intensity * 300,
            speed: 2 + intensity * 3,
            opacity: 0.3 + intensity * 0.7,
            life: 1.0
        };
        this.energyWaves.push(wave);
        console.log('Œ Energy wave created with intensity:', intensity);
    }

    setParticleIntensity(intensity) {
        if (this.particles) {
            // Increase particle speed and size based on intensity
            const positions = this.particles.geometry.attributes.position.array;
            const colors = this.particles.geometry.attributes.color.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Increase particle movement speed
                positions[i] += (Math.random() - 0.5) * intensity * 0.1;
                positions[i + 1] += (Math.random() - 0.5) * intensity * 0.1;
                
                // Make particles more colorful
                colors[i] = Math.min(1, colors[i] + intensity * 0.3);
                colors[i + 1] = Math.min(1, colors[i + 1] + intensity * 0.3);
                colors[i + 2] = Math.min(1, colors[i + 2] + intensity * 0.3);
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.color.needsUpdate = true;
        }
    }

    // Cleanup
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.isInitialized = false;
    }
}

// Export for use in other modules
window.CosmicEffects = CosmicEffects;


