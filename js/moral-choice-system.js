/**
 * Moral Choice System - Non-blocking overlays for cosmic moral dilemmas
 * Provides choices that affect player alignment and quest outcomes
 */

class MoralChoiceSystem {
    constructor() {
        this.playerAlignment = {
            cosmic: 0,    // -100 to +100 (chaos to order)
            ethical: 0,   // -100 to +100 (evil to good)
            wisdom: 0     // -100 to +100 (ignorance to enlightenment)
        };
        this.choiceHistory = [];
        this.activeOverlay = null;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        console.log('⚖️ Moral Choice System initialized');
        this.loadAlignment();
        this.loadChoiceHistory();
    }

    loadAlignment() {
        try {
            const saved = localStorage.getItem('eldritch-moral-alignment');
            if (saved) {
                this.playerAlignment = { ...this.playerAlignment, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('⚖️ Failed to load moral alignment', e);
        }
    }

    saveAlignment() {
        try {
            localStorage.setItem('eldritch-moral-alignment', JSON.stringify(this.playerAlignment));
        } catch (e) {
            console.warn('⚖️ Failed to save moral alignment', e);
        }
    }

    loadChoiceHistory() {
        try {
            const saved = localStorage.getItem('eldritch-choice-history');
            if (saved) {
                this.choiceHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('⚖️ Failed to load choice history', e);
        }
    }

    saveChoiceHistory() {
        try {
            localStorage.setItem('eldritch-choice-history', JSON.stringify(this.choiceHistory));
        } catch (e) {
            console.warn('⚖️ Failed to save choice history', e);
        }
    }

    // Show moral choice overlay
    showMoralChoice(choiceData) {
        if (this.activeOverlay) {
            this.hideMoralChoice();
        }

        const {
            title = "Cosmic Choice",
            description = "A moment of moral reckoning approaches...",
            choices = [],
            onChoice = null,
            timeout = 30000 // 30 seconds default
        } = choiceData;

        this.activeOverlay = document.createElement('div');
        this.activeOverlay.className = 'moral-choice-overlay';
        // Use CSS classes instead of inline styles for better control
        this.activeOverlay.style.cssText = `
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        this.activeOverlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; color: var(--cosmic-purple); font-size: 16px;">⚖️ ${title}</h3>
                <button id="moral-choice-close" style="background: none; border: none; color: var(--cosmic-red); font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
            </div>
            <div style="margin-bottom: 16px; font-size: 13px; line-height: 1.4; opacity: 0.9;">
                ${description}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${choices.map((choice, index) => `
                    <button class="moral-choice-btn" data-choice-index="${index}" style="
                        background: linear-gradient(45deg, ${choice.color || '#4b0082'}, ${choice.color2 || '#8a2be2'});
                        border: 1px solid ${choice.borderColor || '#ff00ff'};
                        color: ${choice.textColor || '#ffffff'};
                        padding: 10px 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 12px;
                        text-align: left;
                        transition: all 0.2s ease;
                        font-family: inherit;
                    ">
                        <div style="font-weight: bold; margin-bottom: 4px;">${choice.text}</div>
                        ${choice.description ? `<div style="font-size: 11px; opacity: 0.8;">${choice.description}</div>` : ''}
                        ${choice.consequences ? `<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">${choice.consequences}</div>` : ''}
                    </button>
                `).join('')}
            </div>
            <div style="margin-top: 12px; font-size: 10px; opacity: 0.6; text-align: center;">
                This choice will affect your cosmic alignment
            </div>
        `;

        document.body.appendChild(this.activeOverlay);
        this.isVisible = true;

        // Animate in
        setTimeout(() => {
            if (this.activeOverlay) {
                this.activeOverlay.classList.add('visible');
            }
        }, 10);

        // Add event listeners
        this.activeOverlay.querySelector('#moral-choice-close').addEventListener('click', () => {
            this.hideMoralChoice();
        });

        this.activeOverlay.querySelectorAll('.moral-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget || e.target.closest('.moral-choice-btn');
                const choiceIndex = parseInt(target?.dataset?.choiceIndex);
                if (Number.isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= choices.length) {
                    console.warn('⚖️ Invalid choice index', choiceIndex);
                    return;
                }
                this.handleChoice(choiceIndex, choices[choiceIndex], onChoice);
            });

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.02)';
                btn.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            });
        });

        // Auto-hide after timeout
        if (timeout > 0) {
            setTimeout(() => {
                if (this.isVisible) {
                    this.hideMoralChoice();
                }
            }, timeout);
        }

        // Audio feedback
        if (window.soundManager && typeof window.soundManager.playEerieHum === 'function') {
            try { window.soundManager.playEerieHum(); } catch (e) {}
        }
    }

    handleChoice(choiceIndex, choice, onChoice) {
        console.log('⚖️ Moral choice made:', choice.text);
        
        // Apply alignment changes
        if (choice.alignment) {
            this.updateAlignment(choice.alignment);
        }

        // Record choice
        this.choiceHistory.push({
            timestamp: Date.now(),
            choice: choice.text,
            alignment: choice.alignment || {},
            context: choice.context || 'unknown'
        });
        this.saveChoiceHistory();

        // Show feedback
        this.showChoiceFeedback(choice);

        // Call callback
        if (onChoice) {
            try {
                onChoice(choiceIndex, choice, this.playerAlignment);
            } catch (e) {
                console.error('⚖️ Error in choice callback:', e);
            }
        }

        // Hide overlay
        this.hideMoralChoice();
    }

    updateAlignment(changes) {
        Object.keys(changes).forEach(axis => {
            if (this.playerAlignment.hasOwnProperty(axis)) {
                this.playerAlignment[axis] = Math.max(-100, Math.min(100, 
                    this.playerAlignment[axis] + changes[axis]
                ));
            }
        });
        this.saveAlignment();
        console.log('⚖️ Alignment updated:', this.playerAlignment);
        try { window.statistics?.logMoralityChange?.(changes, 'moral_choice'); } catch (_) {}
    }

    showChoiceFeedback(choice) {
        if (window.gruesomeNotifications && typeof window.gruesomeNotifications.show === 'function') {
            const alignment = choice.alignment || {};
            const changes = Object.entries(alignment).map(([axis, value]) => {
                const sign = value > 0 ? '+' : '';
                return `${axis}: ${sign}${value}`;
            }).join(', ');
            
            const message = changes ? `Alignment: ${changes}` : 'Choice recorded';
            const flavor = choice.flavor || (value => value > 0 ? 'A strange warmth floods your veins.' : 'Cold cosmic dread seeps into your bones.');
            const flavorText = changes ? ` ${flavor(Object.values(alignment)[0] || 0)}` : '';
            window.gruesomeNotifications.show('⚖️ Choice Made', message + flavorText, 'info');
        }

        // Visual effect
        if (choice.effect) {
            this.showChoiceEffect(choice.effect);
        }
    }

    showChoiceEffect(effect) {
        // Simple visual effects for choices
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            z-index: 10004;
            pointer-events: none;
            animation: moralEffect 2s ease-out forwards;
        `;
        effectDiv.textContent = effect;
        document.body.appendChild(effectDiv);

        setTimeout(() => {
            if (effectDiv.parentNode) {
                effectDiv.parentNode.removeChild(effectDiv);
            }
        }, 2000);
    }

    hideMoralChoice() {
        if (this.activeOverlay) {
            this.activeOverlay.classList.remove('visible');
            setTimeout(() => {
                if (this.activeOverlay && this.activeOverlay.parentNode) {
                    this.activeOverlay.parentNode.removeChild(this.activeOverlay);
                }
                this.activeOverlay = null;
                this.isVisible = false;
            }, 300);
        }
    }

    // Predefined moral choice templates
    getCosmicChoices() {
        return {
            ancientKnowledge: {
                title: "Forbidden Knowledge",
                description: "You discover an ancient tome containing cosmic secrets. Do you...",
                choices: [
                    {
                        text: "Study the Tome",
                        description: "Learn forbidden knowledge",
                        consequences: "Wisdom +20, Sanity -10",
                        alignment: { wisdom: 20, ethical: -10 },
                        color: "#ffaa00",
                        color2: "#ff8800",
                        borderColor: "#ffff00"
                    },
                    {
                        text: "Destroy It",
                        description: "Protect others from corruption",
                        consequences: "Ethical +15, Wisdom -5",
                        alignment: { ethical: 15, wisdom: -5 },
                        color: "#00ff00",
                        color2: "#00cc00",
                        borderColor: "#ffffff"
                    },
                    {
                        text: "Seal It Away",
                        description: "Hide it for future generations",
                        consequences: "Balanced approach",
                        alignment: { wisdom: 5, ethical: 5 },
                        color: "#0080ff",
                        color2: "#0066cc",
                        borderColor: "#00ffff"
                    }
                ]
            },
            cosmicEntity: {
                title: "Cosmic Entity Approaches",
                description: "A powerful entity offers you a choice that will affect reality itself.",
                choices: [
                    {
                        text: "Accept Power",
                        description: "Gain cosmic abilities",
                        consequences: "Cosmic +30, Ethical -20",
                        alignment: { cosmic: 30, ethical: -20 },
                        color: "#ff00ff",
                        color2: "#cc00cc",
                        borderColor: "#ff0080"
                    },
                    {
                        text: "Refuse Politely",
                        description: "Maintain your humanity",
                        consequences: "Ethical +25, Cosmic -10",
                        alignment: { ethical: 25, cosmic: -10 },
                        color: "#00ff88",
                        color2: "#00cc66",
                        borderColor: "#ffffff"
                    },
                    {
                        text: "Negotiate",
                        description: "Try to find a middle ground",
                        consequences: "Wisdom +15, Balanced",
                        alignment: { wisdom: 15, cosmic: 5, ethical: 5 },
                        color: "#ffaa00",
                        color2: "#ff8800",
                        borderColor: "#ffff00"
                    }
                ]
            },
            innocentSuffering: {
                title: "Innocent Suffering",
                description: "You witness an innocent being tormented by cosmic forces. What do you do?",
                choices: [
                    {
                        text: "Intervene Directly",
                        description: "Risk everything to save them",
                        consequences: "Ethical +30, Cosmic -15",
                        alignment: { ethical: 30, cosmic: -15 },
                        color: "#ff0000",
                        color2: "#cc0000",
                        borderColor: "#ffffff"
                    },
                    {
                        text: "Find Another Way",
                        description: "Use wisdom to solve the problem",
                        consequences: "Wisdom +20, Ethical +10",
                        alignment: { wisdom: 20, ethical: 10 },
                        color: "#0080ff",
                        color2: "#0066cc",
                        borderColor: "#00ffff"
                    },
                    {
                        text: "Accept the Inevitable",
                        description: "Some suffering cannot be prevented",
                        consequences: "Cosmic +10, Ethical -10",
                        alignment: { cosmic: 10, ethical: -10 },
                        color: "#800080",
                        color2: "#660066",
                        borderColor: "#ff00ff"
                    }
                ]
            }
        };
    }

    // Trigger a random moral choice
    triggerRandomChoice() {
        const choices = this.getCosmicChoices();
        const choiceKeys = Object.keys(choices);
        const randomKey = choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
        
        this.showMoralChoice({
            ...choices[randomKey],
            onChoice: (index, choice, alignment) => {
                console.log('⚖️ Random choice completed:', choice.text);
                if (window.gruesomeNotifications && typeof window.gruesomeNotifications.show === 'function') {
                    window.gruesomeNotifications.show('⚖️ Choice Recorded', 'Your cosmic alignment has shifted', 'info');
                }
            }
        });
    }

    // Get current alignment summary
    getAlignmentSummary() {
        const cosmic = this.playerAlignment.cosmic;
        const ethical = this.playerAlignment.ethical;
        const wisdom = this.playerAlignment.wisdom;

        let cosmicDesc = cosmic > 50 ? 'Ordered' : cosmic < -50 ? 'Chaotic' : 'Balanced';
        let ethicalDesc = ethical > 50 ? 'Good' : ethical < -50 ? 'Evil' : 'Neutral';
        let wisdomDesc = wisdom > 50 ? 'Enlightened' : wisdom < -50 ? 'Ignorant' : 'Seeking';

        return {
            cosmic: { value: cosmic, description: cosmicDesc },
            ethical: { value: ethical, description: ethicalDesc },
            wisdom: { value: wisdom, description: wisdomDesc }
        };
    }

    // --- New helpers: nickname and derived stat/modifiers ---
    getAlignment() {
        return { ...this.playerAlignment };
    }

    getNickname() {
        const a = this.playerAlignment;
        // Determine primary axis by absolute value
        const entries = [
            ['cosmic', a.cosmic],
            ['ethical', a.ethical],
            ['wisdom', a.wisdom]
        ].sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
        const [axis, value] = entries[0];
        // Titles per axis and polarity
        const titles = {
            cosmic: value >= 30 ? 'Orderbound' : value <= -30 ? 'Chaos-Touched' : 'Wanderer',
            ethical: value >= 30 ? 'Good Samaritan' : value <= -30 ? 'Bar Fighter' : 'Drifter',
            wisdom: value >= 30 ? 'Enlightened' : value <= -30 ? 'Fool' : 'Seeker'
        };
        return titles[axis];
    }

    // Small combat modifier based on morals
    getCombatModifier() {
        const { cosmic, ethical, wisdom } = this.playerAlignment;
        let bonus = 0;
        // Wisdom helps planning
        if (wisdom > 50) bonus += 0.10; else if (wisdom < -50) bonus -= 0.10;
        // Ethical courage
        if (ethical > 50) bonus += 0.05; else if (ethical < -50) bonus -= 0.05;
        // Cosmic order provides steadiness, chaos is risky but sometimes rewarding
        if (cosmic > 50) bonus += 0.05; else if (cosmic < -50) bonus -= 0.02; // chaos slightly harmful by default
        // Clamp
        return Math.max(-0.2, Math.min(0.2, bonus));
    }

    // Derived stat nudges (non-persistent, for display or temporary use)
    getDerivedStatModifiers() {
        const { cosmic, ethical, wisdom } = this.playerAlignment;
        return {
            attack: Math.round((wisdom > 0 ? wisdom : 0) * 0.05 + (ethical > 0 ? ethical : 0) * 0.03),
            defense: Math.round((cosmic > 0 ? cosmic : 0) * 0.04),
            luck: Math.round((cosmic < 0 ? -cosmic : 0) * 0.03),
            diplomacy: Math.round((ethical > 0 ? ethical : 0) * 0.05),
            investigation: Math.round((wisdom > 0 ? wisdom : 0) * 0.05)
        };
    }
}

// Initialize global instance
window.moralChoiceSystem = new MoralChoiceSystem();
