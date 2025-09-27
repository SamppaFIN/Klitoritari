/**
 * Magnetic Button System
 * Creates interactive 3D buttons with magnetic effects using Three.js and GSAP
 */

// Prevent duplicate class declaration
if (typeof window.MagneticButtonSystem !== 'undefined') {
    console.warn('⚠️ MagneticButtonSystem already exists, skipping duplicate declaration');
} else {

class MagneticButtonSystem {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.buttons = new Map();
        this.hoveredButton = null;
        this.activeButton = null;
        
        // Magnetic effect settings
        this.magneticStrength = 0.3;
        this.hoverScale = 1.1;
        this.clickScale = 0.95;
        this.animationDuration = 0.3;
        
        // Touch/mouse position
        this.mouse = new THREE.Vector2();
        this.touch = new THREE.Vector2();
        
        console.log('🧲 Magnetic Button System: Initialized');
    }
    
    createButton(config) {
        const {
            id,
            position = { x: 0, y: 0, z: 0 },
            size = { width: 2, height: 0.5, depth: 0.1 },
            color = 0x6a0dad,
            hoverColor = 0x8b5cf6,
            text = 'Button',
            icon = null,
            onClick = null,
            magnetic = true
        } = config;
        
        // Create button geometry
        const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        
        // Create button material
        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        // Create button mesh
        const buttonMesh = new THREE.Mesh(geometry, material);
        buttonMesh.position.set(position.x, position.y, position.z);
        buttonMesh.castShadow = true;
        buttonMesh.receiveShadow = true;
        
        // Add glow effect
        const glowGeometry = new THREE.BoxGeometry(size.width * 1.2, size.height * 1.2, size.depth * 1.2);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.copy(buttonMesh.position);
        buttonMesh.add(glowMesh);
        
        // Create text if provided
        if (text) {
            const textMesh = this.createTextMesh(text, size.height * 0.6);
            textMesh.position.set(0, 0, size.depth / 2 + 0.01);
            buttonMesh.add(textMesh);
        }
        
        // Create icon if provided
        if (icon) {
            const iconMesh = this.createIconMesh(icon, size.height * 0.8);
            iconMesh.position.set(0, 0, size.depth / 2 + 0.01);
            buttonMesh.add(iconMesh);
        }
        
        // Store button data
        const button = {
            id,
            mesh: buttonMesh,
            material,
            glowMaterial,
            originalColor: color,
            hoverColor,
            originalPosition: { ...position },
            originalScale: { x: 1, y: 1, z: 1 },
            magnetic,
            onClick,
            isHovered: false,
            isPressed: false
        };
        
        // Add user data for interaction
        buttonMesh.userData = {
            type: 'magneticButton',
            buttonId: id,
            onClick: () => this.handleButtonClick(button)
        };
        
        this.buttons.set(id, button);
        
        // Add to scene
        this.sceneManager.addUIElement(id, {
            object: buttonMesh,
            interactive: true,
            update: (deltaTime) => this.updateButton(button, deltaTime)
        });
        
        console.log('🧲 Magnetic Button created:', id);
        return button;
    }
    
    createTextMesh(text, size) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = '#ffffff';
        context.font = `${size * 20}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }
    
    createIconMesh(icon, size) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        
        context.fillStyle = '#ffffff';
        context.font = `${size * 20}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(icon, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(0.8, 0.8);
        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }
    
    updateButton(button, deltaTime) {
        if (!button.magnetic) return;
        
        // Get current mouse/touch position
        const pointer = this.sceneManager.isMobile ? this.sceneManager.touch : this.sceneManager.mouse;
        
        // Calculate distance from button to pointer
        const buttonPosition = new THREE.Vector3();
        button.mesh.getWorldPosition(buttonPosition);
        
        const pointer3D = new THREE.Vector3(pointer.x * 10, pointer.y * 10, 0);
        const distance = buttonPosition.distanceTo(pointer3D);
        
        // Magnetic effect
        if (distance < 3) {
            const magneticForce = (3 - distance) / 3 * this.magneticStrength;
            const direction = new THREE.Vector3().subVectors(pointer3D, buttonPosition).normalize();
            
            const targetPosition = buttonPosition.clone().add(
                direction.multiplyScalar(magneticForce)
            );
            
            // Smooth movement to target position
            button.mesh.position.lerp(targetPosition, 0.1);
            
            // Hover effect
            if (!button.isHovered) {
                this.onButtonHover(button);
            }
        } else {
            // Return to original position
            const originalPos = new THREE.Vector3(
                button.originalPosition.x,
                button.originalPosition.y,
                button.originalPosition.z
            );
            button.mesh.position.lerp(originalPos, 0.1);
            
            if (button.isHovered) {
                this.onButtonUnhover(button);
            }
        }
    }
    
    onButtonHover(button) {
        button.isHovered = true;
        
        // Check if GSAP is available
        if (typeof GSAP === 'undefined') {
            console.warn('⚠️ GSAP not available, using fallback animation');
            button.mesh.scale.set(this.hoverScale, this.hoverScale, this.hoverScale);
            return;
        }
        
        // Scale animation
        GSAP.to(button.mesh.scale, {
            x: this.hoverScale,
            y: this.hoverScale,
            z: this.hoverScale,
            duration: this.animationDuration,
            ease: "back.out(1.7)"
        });
        
        // Color animation
        GSAP.to(button.material.color, {
            r: button.hoverColor.r || (button.hoverColor >> 16) / 255,
            g: button.hoverColor.g || ((button.hoverColor >> 8) & 255) / 255,
            b: button.hoverColor.b || (button.hoverColor & 255) / 255,
            duration: this.animationDuration
        });
        
        // Glow animation
        GSAP.to(button.glowMaterial, {
            opacity: 0.4,
            duration: this.animationDuration
        });
        
        console.log('🧲 Button hovered:', button.id);
    }
    
    onButtonUnhover(button) {
        button.isHovered = false;
        
        // Check if GSAP is available
        if (typeof GSAP === 'undefined') {
            console.warn('⚠️ GSAP not available, using fallback animation');
            button.mesh.scale.set(button.originalScale.x, button.originalScale.y, button.originalScale.z);
            return;
        }
        
        // Scale animation
        GSAP.to(button.mesh.scale, {
            x: button.originalScale.x,
            y: button.originalScale.y,
            z: button.originalScale.z,
            duration: this.animationDuration,
            ease: "back.out(1.7)"
        });
        
        // Color animation
        const originalColor = new THREE.Color(button.originalColor);
        GSAP.to(button.material.color, {
            r: originalColor.r,
            g: originalColor.g,
            b: originalColor.b,
            duration: this.animationDuration
        });
        
        // Glow animation
        GSAP.to(button.glowMaterial, {
            opacity: 0.2,
            duration: this.animationDuration
        });
        
        console.log('🧲 Button unhovered:', button.id);
    }
    
    handleButtonClick(button) {
        if (button.isPressed) return;
        
        button.isPressed = true;
        
        // Check if GSAP is available
        if (typeof GSAP === 'undefined') {
            console.warn('⚠️ GSAP not available, using fallback animation');
            button.mesh.scale.set(this.clickScale, this.clickScale, this.clickScale);
            setTimeout(() => {
                button.mesh.scale.set(1, 1, 1);
                button.isPressed = false;
            }, 200);
        } else {
            // Click animation
            GSAP.to(button.mesh.scale, {
                x: this.clickScale,
                y: this.clickScale,
                z: this.clickScale,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    button.isPressed = false;
                }
            });
        }
        
        // Particle effect
        this.createClickEffect(button.mesh.position);
        
        // Call onClick callback
        if (button.onClick) {
            button.onClick(button);
        }
        
        console.log('🧲 Button clicked:', button.id);
    }
    
    createClickEffect(position) {
        // Create particle burst effect
        const particleCount = 20;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x6a0dad,
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            particles.add(particle);
        }
        
        this.sceneManager.scene.add(particles);
        
        // Animate particles
        const animateParticles = () => {
            particles.children.forEach(particle => {
                particle.position.add(particle.velocity);
                particle.velocity.multiplyScalar(0.98);
                particle.material.opacity *= 0.95;
            });
            
            if (particles.children[0].material.opacity < 0.01) {
                this.sceneManager.scene.remove(particles);
            } else {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
    }
    
    removeButton(id) {
        const button = this.buttons.get(id);
        if (button) {
            this.sceneManager.removeUIElement(id);
            this.buttons.delete(id);
            console.log('🧲 Button removed:', id);
        }
    }
    
    dispose() {
        this.buttons.forEach(button => {
            this.sceneManager.removeUIElement(button.id);
        });
        this.buttons.clear();
        console.log('🧹 Magnetic Button System disposed');
    }
}

// Export for use in other modules
window.MagneticButtonSystem = MagneticButtonSystem;

} // End of duplicate check
