/**
 * Particle Effects System
 * Creates beautiful particle effects for interactions and ambiance
 */

class ParticleEffectsSystem {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.particleSystems = new Map();
        this.activeEffects = new Map();
        
        // Particle materials
        this.particleMaterial = new THREE.PointsMaterial({
            color: 0x6a0dad,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.glowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        console.log('✨ Particle Effects System: Initialized');
    }
    
    createBurstEffect(position, config = {}) {
        const {
            particleCount = 50,
            color = 0x6a0dad,
            size = 0.1,
            speed = 2,
            life = 2,
            spread = 1
        } = config;
        
        const particles = new THREE.Group();
        const particleArray = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle({
                position: position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread
                ).multiplyScalar(speed),
                color,
                size: size * (0.5 + Math.random() * 0.5),
                life: life * (0.5 + Math.random() * 0.5)
            });
            
            particles.add(particle);
            particleArray.push(particle);
        }
        
        this.sceneManager.scene.add(particles);
        
        // Animate particles
        const animateParticles = () => {
            let allDead = true;
            
            particleArray.forEach(particle => {
                if (particle.userData.life > 0) {
                    particle.position.add(particle.userData.velocity);
                    particle.userData.velocity.multiplyScalar(0.98);
                    particle.userData.life -= 0.016;
                    
                    // Fade out
                    particle.material.opacity = particle.userData.life / particle.userData.maxLife;
                    
                    allDead = false;
                }
            });
            
            if (allDead) {
                this.sceneManager.scene.remove(particles);
            } else {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
        
        console.log('✨ Burst effect created at:', position);
    }
    
    createTrailEffect(startPosition, endPosition, config = {}) {
        const {
            particleCount = 20,
            color = 0x3b82f6,
            size = 0.05,
            speed = 1
        } = config;
        
        const particles = new THREE.Group();
        const direction = new THREE.Vector3().subVectors(endPosition, startPosition).normalize();
        const distance = startPosition.distanceTo(endPosition);
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const position = startPosition.clone().add(direction.clone().multiplyScalar(distance * t));
            
            const particle = this.createParticle({
                position,
                velocity: direction.clone().multiplyScalar(speed),
                color,
                size,
                life: 1
            });
            
            particles.add(particle);
        }
        
        this.sceneManager.scene.add(particles);
        
        // Animate particles
        const animateParticles = () => {
            let allDead = true;
            
            particles.children.forEach(particle => {
                if (particle.userData.life > 0) {
                    particle.position.add(particle.userData.velocity);
                    particle.userData.life -= 0.02;
                    particle.material.opacity = particle.userData.life / particle.userData.maxLife;
                    
                    if (particle.userData.life > 0) allDead = false;
                }
            });
            
            if (allDead) {
                this.sceneManager.scene.remove(particles);
            } else {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
        
        console.log('✨ Trail effect created from', startPosition, 'to', endPosition);
    }
    
    createAmbientParticles(config = {}) {
        const {
            particleCount = 100,
            color = 0x6a0dad,
            size = 0.02,
            area = { width: 20, height: 20, depth: 20 },
            speed = 0.1
        } = config;
        
        const particles = new THREE.Group();
        const particleArray = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * area.width,
                    (Math.random() - 0.5) * area.height,
                    (Math.random() - 0.5) * area.depth
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed
                ),
                color,
                size,
                life: Infinity // Ambient particles live forever
            });
            
            particles.add(particle);
            particleArray.push(particle);
        }
        
        this.sceneManager.scene.add(particles);
        
        // Store for continuous animation
        const effectId = 'ambient_' + Date.now();
        this.activeEffects.set(effectId, {
            particles,
            particleArray,
            area,
            speed
        });
        
        // Animate particles
        const animateParticles = () => {
            particleArray.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                
                // Wrap around area
                if (particle.position.x > area.width / 2) particle.position.x = -area.width / 2;
                if (particle.position.x < -area.width / 2) particle.position.x = area.width / 2;
                if (particle.position.y > area.height / 2) particle.position.y = -area.height / 2;
                if (particle.position.y < -area.height / 2) particle.position.y = area.height / 2;
                if (particle.position.z > area.depth / 2) particle.position.z = -area.depth / 2;
                if (particle.position.z < -area.depth / 2) particle.position.z = area.depth / 2;
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        
        console.log('✨ Ambient particles created:', particleCount);
        return effectId;
    }
    
    createParticle(config) {
        const {
            position,
            velocity,
            color,
            size,
            life
        } = config;
        
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        
        particle.userData = {
            velocity,
            life,
            maxLife: life,
            originalSize: size
        };
        
        return particle;
    }
    
    createMagneticField(center, radius, config = {}) {
        const {
            particleCount = 30,
            color = 0x8b5cf6,
            size = 0.03,
            speed = 0.5
        } = config;
        
        const particles = new THREE.Group();
        const particleArray = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Create particles in a sphere around the center
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            const r = radius * Math.random();
            
            const position = new THREE.Vector3(
                center.x + r * Math.sin(phi) * Math.cos(theta),
                center.y + r * Math.sin(phi) * Math.sin(theta),
                center.z + r * Math.cos(phi)
            );
            
            const particle = this.createParticle({
                position,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed
                ),
                color,
                size,
                life: Infinity
            });
            
            particles.add(particle);
            particleArray.push(particle);
        }
        
        this.sceneManager.scene.add(particles);
        
        // Store for continuous animation
        const effectId = 'magnetic_' + Date.now();
        this.activeEffects.set(effectId, {
            particles,
            particleArray,
            center,
            radius,
            speed
        });
        
        // Animate particles
        const animateParticles = () => {
            particleArray.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                
                // Magnetic attraction to center
                const direction = new THREE.Vector3().subVectors(center, particle.position).normalize();
                particle.userData.velocity.add(direction.multiplyScalar(0.01));
                
                // Limit velocity
                particle.userData.velocity.clampLength(0, speed);
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        
        console.log('✨ Magnetic field created at:', center);
        return effectId;
    }
    
    removeEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            this.sceneManager.scene.remove(effect.particles);
            this.activeEffects.delete(effectId);
            console.log('✨ Effect removed:', effectId);
        }
    }
    
    dispose() {
        this.activeEffects.forEach(effect => {
            this.sceneManager.scene.remove(effect.particles);
        });
        this.activeEffects.clear();
        console.log('🧹 Particle Effects System disposed');
    }
}

// Export for use in other modules
window.ParticleEffectsSystem = ParticleEffectsSystem;
