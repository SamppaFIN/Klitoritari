/**
 * Investigation System - Mystery exploration and paranormal investigation mechanics
 * Handles different mystery types: paranormal, cosmic-horror, and conspiracy
 */

class InvestigationSystem {
    constructor() {
        this.activeInvestigation = null;
        this.mysteryZones = [];
        this.investigationTypes = {
            paranormal: {
                name: 'Paranormal Activity',
                color: '#6a0dad',
                icon: '👻',
                description: 'Supernatural phenomena and ghostly encounters'
            },
            cosmicHorror: {
                name: 'Cosmic Horror',
                color: '#ff0040',
                icon: '🌌',
                description: 'Eldritch entities and cosmic terrors'
            },
            conspiracy: {
                name: 'Conspiracy',
                color: '#00ff88',
                icon: '🔍',
                description: 'Government cover-ups and secret organizations'
            }
        };
        this.onInvestigationStart = null;
        this.onInvestigationComplete = null;
        this.onInvestigationAbandon = null;
    }

    init() {
        this.setupUI();
        this.loadMysteryZones();
        this.loadInvestigationProgress();
        console.log('🔍 Investigation system initialized');
    }

    setupUI() {
        const startBtn = document.getElementById('start-investigation');
        const cancelBtn = document.getElementById('cancel-investigation');
        const abandonBtn = document.getElementById('abandon-investigation');
        const closeModal = document.getElementById('close-modal');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startInvestigation());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }
        if (abandonBtn) {
            abandonBtn.addEventListener('click', () => this.abandonInvestigation());
        }
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
    }

    loadMysteryZones() {
        // Only main quest mystery zone - Härmälä Convergence
        this.mysteryZones = [
            {
                id: 'harmala-convergence-main',
                name: 'The Härmälä Convergence',
                type: 'main_quest',
                lat: 61.473683430224284,
                lng: 23.726548746143216,
                description: 'Something ancient stirs beneath the streets of Härmälä. The cosmic entities whisper of a convergence that will reshape reality itself... or at least the local bus schedule.',
                requirements: 'Investigate the cosmic anomalies appearing around Härmälä',
                difficulty: 'Main Quest',
                rewards: ['Reality Anchor', 'Void Pocket', 'Härmälä Mystery Solver Title']
            }
        ];

        this.updateZoneList();
    }

    updateZoneList() {
        const zoneList = document.getElementById('zone-list');
        if (!zoneList) return;

        zoneList.innerHTML = '';

        this.mysteryZones.forEach(zone => {
            const zoneElement = this.createZoneElement(zone);
            zoneList.appendChild(zoneElement);
        });
    }

    createZoneElement(zone) {
        const div = document.createElement('div');
        div.className = 'zone-item';
        div.dataset.zoneId = zone.id;
        
        const typeInfo = this.investigationTypes[zone.type];
        
        div.innerHTML = `
            <div class="zone-name">${typeInfo.icon} ${zone.name}</div>
            <div class="zone-type">${typeInfo.name}</div>
            <div class="zone-distance">Difficulty: ${zone.difficulty}</div>
        `;

        div.addEventListener('click', () => this.showInvestigationModal(zone));
        
        return div;
    }

    showInvestigationModal(zone) {
        const modal = document.getElementById('investigation-modal');
        const title = document.getElementById('modal-title');
        const description = document.getElementById('modal-description');
        const requirements = document.getElementById('modal-requirements');
        const startBtn = document.getElementById('start-investigation');

        if (!modal) return;

        const typeInfo = this.investigationTypes[zone.type];
        
        title.textContent = `${typeInfo.icon} ${zone.name}`;
        description.textContent = zone.description;
        requirements.innerHTML = `
            <h4>Investigation Requirements:</h4>
            <p>${zone.requirements}</p>
            <div class="difficulty-info">
                <strong>Difficulty:</strong> <span style="color: ${typeInfo.color}">${zone.difficulty}</span>
            </div>
            <div class="rewards-info">
                <strong>Potential Rewards:</strong> ${zone.rewards.join(', ')}
            </div>
        `;

        startBtn.dataset.zoneId = zone.id;
        modal.classList.remove('hidden');
    }

    startInvestigation() {
        const startBtn = document.getElementById('start-investigation');
        const zoneId = startBtn.dataset.zoneId;
        
        if (!zoneId) return;

        const zone = this.mysteryZones.find(z => z.id === zoneId);
        if (!zone) return;

        this.activeInvestigation = {
            ...zone,
            startTime: Date.now(),
            progress: 0,
            requirements: this.parseRequirements(zone.requirements),
            completedRequirements: []
        };

        this.updateInvestigationUI();
        this.closeModal();
        this.saveInvestigationProgress();

        if (this.onInvestigationStart) {
            this.onInvestigationStart(this.activeInvestigation);
        }

        console.log(`🔍 Started investigation: ${zone.name}`);
    }

    parseRequirements(requirementsText) {
        // Simple requirement parsing - in a real app, this would be more sophisticated
        const requirements = [];
        
        if (requirementsText.includes('Stay within')) {
            const match = requirementsText.match(/Stay within (\d+)m radius for (\d+) minutes/);
            if (match) {
                requirements.push({
                    type: 'proximity',
                    radius: parseInt(match[1]),
                    duration: parseInt(match[2]) * 60 * 1000, // Convert to milliseconds
                    completed: false
                });
            }
        }
        
        if (requirementsText.includes('Document')) {
            const match = requirementsText.match(/Document (\d+) different/);
            if (match) {
                requirements.push({
                    type: 'document',
                    count: parseInt(match[1]),
                    current: 0,
                    completed: false
                });
            }
        }
        
        if (requirementsText.includes('Gather evidence')) {
            const match = requirementsText.match(/Gather evidence of (\d+) suspicious activities/);
            if (match) {
                requirements.push({
                    type: 'evidence',
                    count: parseInt(match[1]),
                    current: 0,
                    completed: false
                });
            }
        }

        return requirements;
    }

    updateInvestigationUI() {
        const panel = document.getElementById('investigation-panel');
        const title = panel.querySelector('.investigation-title');
        const type = panel.querySelector('.investigation-type');
        const progressFill = panel.querySelector('.progress-fill');
        const progressText = panel.querySelector('.progress-text');

        if (!this.activeInvestigation) {
            panel.classList.add('hidden');
            return;
        }

        panel.classList.remove('hidden');
        
        const typeInfo = this.investigationTypes[this.activeInvestigation.type];
        title.textContent = this.activeInvestigation.name;
        type.textContent = typeInfo.name;
        
        const progress = this.calculateProgress();
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    calculateProgress() {
        if (!this.activeInvestigation) return 0;

        const totalRequirements = this.activeInvestigation.requirements.length;
        const completedRequirements = this.activeInvestigation.requirements.filter(req => req.completed).length;
        
        return (completedRequirements / totalRequirements) * 100;
    }

    updateInvestigationProgress(position) {
        if (!this.activeInvestigation) return;

        const zone = this.activeInvestigation;
        const distance = this.calculateDistance(
            position.lat, position.lng,
            zone.lat, zone.lng
        );

        // Check proximity requirements
        this.activeInvestigation.requirements.forEach(req => {
            if (req.type === 'proximity' && !req.completed) {
                if (distance <= req.radius) {
                    const timeInZone = Date.now() - this.activeInvestigation.startTime;
                    if (timeInZone >= req.duration) {
                        req.completed = true;
                        this.showRequirementComplete('Proximity requirement completed!');
                    }
                }
            }
        });

        this.updateInvestigationUI();
        this.checkInvestigationComplete();
    }

    checkInvestigationComplete() {
        if (!this.activeInvestigation) return;

        const allCompleted = this.activeInvestigation.requirements.every(req => req.completed);
        
        if (allCompleted) {
            this.completeInvestigation();
        }
    }

    completeInvestigation() {
        const investigation = this.activeInvestigation;
        
        console.log(`🎉 Investigation completed: ${investigation.name}`);
        
        // Show completion effects
        if (window.cosmicEffects) {
            window.cosmicEffects.createEnergyBurst(
                window.innerWidth / 2, 
                window.innerHeight / 2, 
                2.0
            );
        }

        if (this.onInvestigationComplete) {
            this.onInvestigationComplete(investigation);
        }

        this.activeInvestigation = null;
        this.updateInvestigationUI();
        this.saveInvestigationProgress();
    }

    abandonInvestigation() {
        if (!this.activeInvestigation) return;

        const investigation = this.activeInvestigation;
        console.log(`❌ Investigation abandoned: ${investigation.name}`);
        
        if (this.onInvestigationAbandon) {
            this.onInvestigationAbandon(investigation);
        }

        this.activeInvestigation = null;
        this.updateInvestigationUI();
        this.saveInvestigationProgress();
    }

    closeModal() {
        const modal = document.getElementById('investigation-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showRequirementComplete(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'requirement-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--cosmic-green);
            color: var(--cosmic-dark);
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 3000;
            animation: fadeInOut 3s ease-in-out;
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    loadInvestigationProgress() {
        try {
            const saved = localStorage.getItem('eldritch-investigations');
            if (saved) {
                const data = JSON.parse(saved);
                // Restore any active investigations
                if (data.activeInvestigation) {
                    this.activeInvestigation = data.activeInvestigation;
                    this.updateInvestigationUI();
                }
            }
        } catch (error) {
            console.error('Failed to load investigation progress:', error);
        }
    }

    saveInvestigationProgress() {
        try {
            const data = {
                activeInvestigation: this.activeInvestigation,
                lastSaved: Date.now()
            };
            localStorage.setItem('eldritch-investigations', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save investigation progress:', error);
        }
    }

    // Get mystery zones for map markers
    getMysteryZones() {
        return this.mysteryZones;
    }

    // Get active investigation
    getActiveInvestigation() {
        return this.activeInvestigation;
    }
}

// Export for use in other modules
window.InvestigationSystem = InvestigationSystem;
