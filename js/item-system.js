/**
 * Item System - Cosmic Arsenal Management
 * 
 * Manages weapons, armor, accessories, and eldritch artifacts
 * with dark but amusing Lovecraftian flavor
 */

class ItemSystem {
    constructor() {
        console.log('🎒 ItemSystem constructor called');
        this.items = new Map();
        this.playerInventory = [];
        this.equippedItems = {
            weapon: null,
            armor: null,
            accessory: null
        };
        this.consumableHandlers = this.buildConsumableHandlers();
        
        this.initializeItems();
        this.loadPlayerInventory();
        console.log('🎒 ItemSystem initialized with', this.playerInventory.length, 'items in inventory');
        console.log('🎒 Available items:', Array.from(this.items.keys()));
        console.log('🎒 Health potion defined:', this.items.has('health_potion'));
    }

    // Initialize all available items in the cosmic realm
    initializeItems() {
        // Melee Weapons - Because sometimes you need to hit things with cosmic force
        this.addItem({
            id: 'health_potion',
            name: 'Health Potion',
            type: 'consumable',
            category: 'potion',
            rarity: 'common',
            emoji: '🧪',
            description: 'A glowing red potion that restores health',
            stats: { 
                heal: 20,
                'Healing': '20 HP',
                'Duration': 'Instant',
                'Source': 'Cosmic Alchemy'
            },
            effects: ['restore_health'],
            value: 25,
            weight: 0.1,
            lore: 'Brewed from the tears of cosmic entities, this potion carries the essence of life itself. Each drop contains the concentrated energy of a thousand healing stars.'
        });

        this.addItem({
            id: 'sanity_elixir',
            name: 'Sanity Elixir',
            type: 'consumable',
            category: 'elixir',
            rarity: 'uncommon',
            emoji: '🧠',
            description: 'Soothes the mind and clears the fog.',
            stats: { sanity: 15 },
            effects: ['restore_sanity'],
            value: 45,
            weight: 0.1,
            lore: 'Brewed by the Lunatic Sage, allegedly.'
        });

        this.addItem({
            id: 'power_orb',
            name: 'Power Orb',
            type: 'consumable',
            category: 'orb',
            rarity: 'rare',
            emoji: '⚡',
            description: 'Vibrates with latent potential. Grants experience.',
            stats: { xp: 50 },
            effects: ['grant_experience'],
            value: 120,
            weight: 0.2,
            lore: 'A fragment of a collapsed star, probably.'
        });

        this.addItem({
            id: 'ancient_scroll',
            name: 'Ancient Scroll',
            type: 'consumable',
            category: 'scroll',
            rarity: 'uncommon',
            emoji: '📜',
            description: 'Teaches a small permanent trick of survival.',
            stats: { defense: 1 },
            effects: ['permanent_defense'],
            value: 80,
            weight: 0.1,
            lore: 'Illegible to most, useful to the persistent.'
        });
        this.addItem({
            id: 'rusty_sword',
            name: 'Rusty Cosmic Sword',
            type: 'weapon',
            category: 'melee',
            rarity: 'common',
            emoji: '⚔️',
            description: 'A sword that has seen better eons. The rust is actually cosmic corrosion from the 47th dimension, which is... surprisingly effective.',
            stats: {
                attack: 8,
                durability: 60,
                sanityCost: 0
            },
            effects: [],
            value: 50,
            weight: 3.5,
            lore: 'This sword once belonged to a cosmic knight who got lost in a dimensional maze and gave up after 300 years. The rust is actually a feature, not a bug.'
        });

        this.addItem({
            id: 'void_blade',
            name: 'Void Blade of Infinite Sharpness',
            type: 'weapon',
            category: 'melee',
            rarity: 'rare',
            description: 'A blade forged from the void between dimensions. It cuts through reality itself, which is both impressive and slightly concerning.',
            stats: {
                attack: 25,
                durability: 100,
                sanityCost: 5
            },
            effects: ['void_damage', 'reality_cut'],
            value: 500,
            weight: 2.0,
            lore: 'Forged by the Void Smiths of Dimension 23, this blade can cut through anything except the cosmic warranty that expired 10,000 years ago.'
        });

        this.addItem({
            id: 'eldritch_club',
            name: 'Eldritch Club of Questionable Wisdom',
            type: 'weapon',
            category: 'melee',
            rarity: 'uncommon',
            description: 'A club made from the petrified tentacle of an ancient cosmic entity. It whispers terrible jokes when you swing it.',
            stats: {
                attack: 15,
                durability: 80,
                sanityCost: 3
            },
            effects: ['tentacle_whisper', 'cosmic_humor'],
            value: 200,
            weight: 4.0,
            lore: 'The tentacle belonged to a cosmic comedian who died of laughter. The club still tells its jokes, but they\'re getting a bit stale after 5,000 years.'
        });

        // Ranged Weapons - Because sometimes you need to hit things from a distance
        this.addItem({
            id: 'cosmic_bow',
            name: 'Cosmic Bow of Starlight',
            type: 'weapon',
            category: 'ranged',
            rarity: 'uncommon',
            description: 'A bow that fires arrows of pure starlight. The arrows never run out, but they do complain about the working conditions.',
            stats: {
                attack: 18,
                durability: 90,
                sanityCost: 2
            },
            effects: ['starlight_arrows', 'infinite_ammo'],
            value: 300,
            weight: 2.5,
            lore: 'The arrows are actually tiny cosmic entities who volunteered for this job. They have a union and everything.'
        });

        this.addItem({
            id: 'reality_gun',
            name: 'Reality Gun of Questionable Ethics',
            type: 'weapon',
            category: 'ranged',
            rarity: 'legendary',
            description: 'A gun that shoots holes in reality itself. The holes usually close themselves, but sometimes they lead to unexpected places.',
            stats: {
                attack: 35,
                durability: 120,
                sanityCost: 10
            },
            effects: ['reality_breach', 'dimensional_portal'],
            value: 1000,
            weight: 5.0,
            lore: 'Created by a mad scientist who got tired of dealing with reality\'s bureaucracy. The gun has its own legal team now.'
        });

        // Armor - Because cosmic entities have sharp teeth
        this.addItem({
            id: 'cosmic_robes',
            name: 'Cosmic Robes of Modest Protection',
            type: 'armor',
            category: 'cloth',
            rarity: 'common',
            description: 'Robs woven from the fabric of space itself. They provide minimal protection but look absolutely fabulous.',
            stats: {
                defense: 5,
                durability: 70,
                sanityCost: 0
            },
            effects: ['cosmic_fashion', 'space_weave'],
            value: 100,
            weight: 1.0,
            lore: 'These robes were designed by the Cosmic Fashion Council. They\'re more about style than substance, but style is everything in the cosmic realm.'
        });

        this.addItem({
            id: 'void_armor',
            name: 'Void Armor of Existential Dread',
            type: 'armor',
            category: 'heavy',
            rarity: 'rare',
            description: 'Armor forged from the void itself. It provides excellent protection but constantly whispers about the meaninglessness of existence.',
            stats: {
                defense: 20,
                durability: 100,
                sanityCost: 8
            },
            effects: ['void_protection', 'existential_whispers'],
            value: 600,
            weight: 8.0,
            lore: 'The armor was forged by a cosmic blacksmith who had a mid-life crisis. It\'s very protective but also very depressing.'
        });

        this.addItem({
            id: 'crystal_plate',
            name: 'Crystal Plate of Ancient Wisdom',
            type: 'armor',
            category: 'heavy',
            rarity: 'epic',
            description: 'Armor made from the crystallized wisdom of ancient cosmic entities. It provides protection and occasionally dispenses life advice.',
            stats: {
                defense: 30,
                durability: 150,
                sanityCost: 5
            },
            effects: ['wisdom_protection', 'life_advice'],
            value: 800,
            weight: 10.0,
            lore: 'The crystals contain the accumulated wisdom of 10,000 cosmic sages. They\'re very wise but also very long-winded.'
        });

        // Accessories - Because even cosmic explorers need accessories
        this.addItem({
            id: 'sanity_amulet',
            name: 'Amulet of Questionable Sanity',
            type: 'accessory',
            category: 'magic',
            rarity: 'uncommon',
            description: 'An amulet that protects your sanity by making you question what sanity even means. It\'s very meta.',
            stats: {
                sanityBonus: 15,
                durability: 80,
                sanityCost: 0
            },
            effects: ['sanity_protection', 'meta_awareness'],
            value: 250,
            weight: 0.5,
            lore: 'Created by a cosmic philosopher who got so confused about the nature of reality that they accidentally created a protective amulet.'
        });

        this.addItem({
            id: 'void_ring',
            name: 'Ring of Void Walking',
            type: 'accessory',
            category: 'magic',
            rarity: 'rare',
            description: 'A ring that allows you to walk through the void between dimensions. The void is surprisingly comfortable once you get used to it.',
            stats: {
                voidWalking: true,
                durability: 100,
                sanityCost: 3
            },
            effects: ['void_walking', 'dimensional_comfort'],
            value: 400,
            weight: 0.1,
            lore: 'The ring was given to a cosmic traveler by the Void itself as a thank-you gift. The Void is surprisingly polite once you get to know it.'
        });

        this.addItem({
            id: 'cosmic_compass',
            name: 'Compass of Cosmic Navigation',
            type: 'accessory',
            category: 'utility',
            rarity: 'uncommon',
            description: 'A compass that always points toward the nearest cosmic anomaly. It\'s very helpful for getting lost in interesting ways.',
            stats: {
                navigation: true,
                durability: 90,
                sanityCost: 1
            },
            effects: ['cosmic_navigation', 'anomaly_detection'],
            value: 300,
            weight: 0.3,
            lore: 'The compass was created by a cosmic cartographer who got tired of drawing maps that made sense. Now it points to the most interesting places instead.'
        });

        // Eldritch Artifacts - Because sometimes you need something truly bizarre
        this.addItem({
            id: 'tentacle_wand',
            name: 'Wand of Wiggling Tentacles',
            type: 'weapon',
            category: 'eldritch',
            rarity: 'legendary',
            description: 'A wand that summons wiggling tentacles from the void. The tentacles are friendly but have boundary issues.',
            stats: {
                attack: 30,
                durability: 200,
                sanityCost: 15
            },
            effects: ['tentacle_summon', 'boundary_issues', 'friendly_tentacles'],
            value: 1200,
            weight: 1.5,
            lore: 'The wand was created by a cosmic entity who wanted to make friends but didn\'t understand personal space. The tentacles are very enthusiastic about helping.'
        });

        this.addItem({
            id: 'reality_anchor',
            name: 'Anchor of Reality Stability',
            type: 'accessory',
            category: 'eldritch',
            rarity: 'epic',
            description: 'An anchor that keeps reality stable around you. It\'s very heavy but prevents the universe from collapsing on your head.',
            stats: {
                realityStability: true,
                durability: 300,
                sanityCost: 5
            },
            effects: ['reality_stability', 'universe_protection'],
            value: 1500,
            weight: 15.0,
            lore: 'The anchor was forged by the Cosmic Maintenance Crew after a particularly bad day when three universes collapsed due to paperwork errors.'
        });

        this.addItem({
            id: 'void_pocket',
            name: 'Pocket of Infinite Void',
            type: 'accessory',
            category: 'eldritch',
            rarity: 'legendary',
            description: 'A pocket that contains an infinite void. You can store anything in it, but good luck finding it again.',
            stats: {
                infiniteStorage: true,
                durability: 500,
                sanityCost: 8
            },
            effects: ['infinite_storage', 'void_organization'],
            value: 2000,
            weight: 0.0,
            lore: 'The pocket was created by a cosmic hoarder who got tired of running out of storage space. Now they can store everything, but they can\'t find anything.'
        });
    }

    buildConsumableHandlers() {
        return {
            health_potion: (item) => {
                console.log(`🧪 Health potion handler called`);
                console.log(`🧪 Encounter system available:`, !!window.encounterSystem);
                console.log(`🧪 Player stats available:`, !!window.encounterSystem?.playerStats);
                
                let ps = window.encounterSystem?.playerStats;
                if (!ps) {
                    console.log(`🧪 No player stats available, creating fallback`);
                    // Create fallback player stats for tutorial
                    if (!window.encounterSystem) {
                        window.encounterSystem = { playerStats: { health: 50, maxHealth: 100, sanity: 100, maxSanity: 100 } };
                    } else if (!window.encounterSystem.playerStats) {
                        window.encounterSystem.playerStats = { health: 50, maxHealth: 100, sanity: 100, maxSanity: 100 };
                    }
                    ps = window.encounterSystem.playerStats;
                }
                
                const before = ps.health;
                const healAmount = item.stats?.heal || 50;
                
                console.log(`🧪 Before health: ${before}, max health: ${ps.maxHealth}`);
                
                // Restore health to maximum
                ps.health = ps.maxHealth;
                
                // Reduce sanity by 30 points (cosmic cost)
                const beforeSanity = ps.sanity;
                ps.sanity = Math.max(0, ps.sanity - 30);
                
                console.log(`🧪 After health: ${ps.health}, sanity: ${ps.sanity}`);
                
                // Show cosmic ghost effect
                this.createCosmicGhostEffect();
                
                // Show feedback
                this.feedback(`+${ps.health - before} health, -${beforeSanity - ps.sanity} sanity`, 'success', 'playSuccess');
                
                // Update health bar system immediately
                if (window.healthBar) {
                    window.healthBar.setHealth(ps.health, ps.maxHealth);
                    window.healthBar.setSanity(ps.sanity, ps.maxSanity);
                    console.log(`🧪 Updated health bar: ${ps.health}/${ps.maxHealth}, sanity: ${ps.sanity}/${ps.maxSanity}`);
                }
                
                // Trigger sanity distortion effects due to cosmic cost
                if (window.sanityDistortion) {
                    console.log(`🧪 Triggering sanity distortion effects due to cosmic cost`);
                    window.sanityDistortion.distortionEffects.shake = 0.6;
                    window.sanityDistortion.distortionEffects.colorShift = 0.4;
                    window.sanityDistortion.distortionEffects.cosmicDistortion = 0.5;
                    
                    // Clear effects after 3 seconds
                    setTimeout(() => {
                        if (window.sanityDistortion) {
                            window.sanityDistortion.distortionEffects.shake = 0;
                            window.sanityDistortion.distortionEffects.colorShift = 0;
                            window.sanityDistortion.distortionEffects.cosmicDistortion = 0;
                        }
                    }, 3000);
                }
                
                // Check if this is tutorial potion usage
                console.log(`🧪 Tutorial system available:`, !!window.tutorialEncounterSystem);
                console.log(`🧪 Current tutorial stage:`, window.tutorialEncounterSystem?.tutorialStage);
                console.log(`🧪 Tutorial flags:`, window.tutorialEncounterSystem?.tutorialFlags);
                
                // Always trigger tutorial progression for health potion usage
                if (window.tutorialEncounterSystem) {
                    console.log(`🧪 Triggering tutorial potion usage handler`);
                    this.handleTutorialPotionUsage();
                } else {
                    console.log(`🧪 Tutorial system not available, skipping tutorial progression`);
                }
                
                return true;
            },
            sanity_elixir: (item) => {
                const ps = window.encounterSystem?.playerStats;
                if (!ps) return false;
                const before = ps.sanity;
                ps.sanity = Math.min(ps.maxSanity, ps.sanity + (item.stats?.sanity || 0));
                this.feedback(`+${ps.sanity - before} sanity`, 'info', 'playNotification');
                return true;
            },
            power_orb: (item) => {
                const ps = window.encounterSystem?.playerStats;
                if (!ps) return false;
                ps.experience = (ps.experience || 0) + (item.stats?.xp || 0);
                this.feedback(`+${item.stats?.xp || 0} XP`, 'success', 'playSuccess');
                return true;
            },
            ancient_scroll: (item) => {
                const ps = window.encounterSystem?.playerStats;
                if (!ps) return false;
                ps.defense = (ps.defense || 0) + (item.stats?.defense || 0);
                this.feedback(`Defense +${item.stats?.defense || 0} (permanent)`, 'success', 'playNotification');
                return true;
            }
        };
    }

    feedback(message, type, soundMethod) {
        try { window.inventoryUI?.showNotification?.(message, type); } catch (_) {}
        try { if (window.soundManager && typeof window.soundManager[soundMethod] === 'function') window.soundManager[soundMethod](); } catch (_) {}
        try { window.encounterSystem?.updateSimpleStatsDisplay?.(); } catch (_) {}
        this.savePlayerInventory();
    }
    
    createCosmicGhostEffect() {
        console.log('🎆 Creating cosmic fireworks effect...');
        
        // Create fireworks container
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'cosmic-fireworks-container';
        fireworksContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            overflow: hidden;
        `;
        
        document.body.appendChild(fireworksContainer);
        
        // Create multiple fireworks bursts
        this.createFireworksBursts(fireworksContainer);
        
        // Create cosmic notification
        this.createCosmicGhostNotification();
        
        // Remove container after animation
        setTimeout(() => {
            if (fireworksContainer.parentNode) {
                fireworksContainer.parentNode.removeChild(fireworksContainer);
            }
        }, 5000);
    }
    
    createFireworksBursts(container) {
        const burstCount = 8;
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                burst.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: radial-gradient(circle, ${color} 0%, transparent 70%);
                    animation: fireworksBurst 2s ease-out forwards;
                    box-shadow: 0 0 20px ${color};
                `;
                
                container.appendChild(burst);
                
                // Create sparkles around the burst
                this.createSparkles(container, x, y, color);
                
                setTimeout(() => {
                    if (burst.parentNode) {
                        burst.parentNode.removeChild(burst);
                    }
                }, 2000);
            }, i * 300);
        }
    }
    
    createSparkles(container, x, y, color) {
        const sparkleCount = 12;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            const angle = (i / sparkleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const sparkleX = x + Math.cos(angle) * distance;
            const sparkleY = y + Math.sin(angle) * distance;
            
            sparkle.style.cssText = `
                position: absolute;
                left: ${sparkleX}%;
                top: ${sparkleY}%;
                width: 3px;
                height: 3px;
                background: ${color};
                border-radius: 50%;
                animation: sparkleFloat 1.5s ease-out forwards;
                box-shadow: 0 0 8px ${color};
            `;
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }
    
    createCosmicGhostNotification() {
        const notification = document.createElement('div');
        notification.className = 'cosmic-ghost-notification';
        notification.innerHTML = `
            <div style="text-align: center; font-family: 'Courier New', monospace;">
                <h3 style="color: #ff6b6b; margin: 0 0 10px 0; text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);">🎆 Cosmic Fireworks!</h3>
                <p style="margin: 0 0 10px 0; color: #4ecdc4; font-size: 1.1rem;">The potion's power explodes in a burst of cosmic energy!</p>
                <p style="margin: 0; color: #feca57; font-size: 0.9rem;">But the cosmic cost to your sanity is real...</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid rgba(74, 158, 255, 0.6);
            border-radius: 20px;
            padding: 30px;
            z-index: 10002;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(74, 158, 255, 0.4);
            animation: cosmicGhostNotification 4s ease-in-out;
            max-width: 400px;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    handleTutorialPotionUsage() {
        console.log('📚 Handling tutorial potion usage...');
        console.log('📚 Tutorial system available:', !!window.tutorialEncounterSystem);
        console.log('📚 Current tutorial stage before:', window.tutorialEncounterSystem?.tutorialStage);
        
        // Advance tutorial stage
        if (window.tutorialEncounterSystem) {
            window.tutorialEncounterSystem.tutorialStage = 3;
            window.tutorialEncounterSystem.tutorialFlags.set('potion_used', true);
            window.tutorialEncounterSystem.saveTutorialState();
            
            console.log('📚 Tutorial stage advanced to:', window.tutorialEncounterSystem.tutorialStage);
            console.log('📚 Tutorial flags:', Array.from(window.tutorialEncounterSystem.tutorialFlags.entries()));
            
            // Show quest window about mind being shattered
            setTimeout(() => {
                // Show quest window with mind shattered message
                this.showQuestWindow(`
                    <div style="text-align: center; padding: 20px;">
                        <h2 style="color: #ff6b6b; margin-bottom: 15px;">🌀 Quest: Mind Shattered</h2>
                        <div style="background: rgba(255, 107, 107, 0.1); border: 2px solid #ff6b6b; border-radius: 10px; padding: 15px; margin: 15px 0;">
                            <p style="font-size: 16px; line-height: 1.6; color: #ff6b6b;">
                                <strong>Something is not right...</strong><br><br>
                                The cosmic potion has restored your health, but at a terrible cost. Your mind feels shattered, reality seems to warp around you, and you can hear whispers from beyond the veil of normal perception.
                                <br><br>
                                <em>"The cosmic truth was too much for mortal comprehension..."</em>
                            </p>
                        </div>
                        <p style="color: #4ecdc4; font-size: 14px;">
                            <strong>Objective:</strong> Find a meditation shrine to restore your sanity through peaceful contemplation.
                        </p>
                    </div>
                `);
                
                // Spawn meditation shrine immediately
                console.log('📚 Spawning meditation shrine...');
                console.log('📚 Map engine available:', !!window.mapEngine);
                console.log('📚 Map available:', !!(window.mapEngine && window.mapEngine.map));
                
                // Try to spawn shrine with retry logic
                const trySpawnShrine = (attempts = 0) => {
                    if (attempts > 5) {
                        console.error('📚 Failed to spawn shrine after 5 attempts');
                        return;
                    }
                    
                    if (window.mapEngine && window.mapEngine.map) {
                        console.log('📚 Map is ready, spawning shrine...');
                        window.tutorialEncounterSystem.spawnMeditationShrine();
                    } else {
                        console.log(`📚 Map not ready, retrying in 1 second... (attempt ${attempts + 1})`);
                        setTimeout(() => trySpawnShrine(attempts + 1), 1000);
                    }
                };
                
                trySpawnShrine();
            }, 1000);
        } else {
            console.error('📚 Tutorial system not available for potion usage handler');
        }
    }

    showQuestWindow(content) {
        // Create quest window overlay
        const questWindow = document.createElement('div');
        questWindow.id = 'quest-window';
        questWindow.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-in-out;
        `;
        
        questWindow.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4ecdc4;
                border-radius: 15px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                position: relative;
            ">
                <div style="
                    background: linear-gradient(90deg, #4ecdc4, #44a08d);
                    color: #1a1a2e;
                    padding: 15px 20px;
                    border-radius: 13px 13px 0 0;
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                ">
                    🌌 Quest Received
                </div>
                <div style="padding: 0;">
                    ${content}
                </div>
                <div style="
                    padding: 20px;
                    text-align: center;
                    border-top: 1px solid #333;
                ">
                    <button onclick="this.closest('#quest-window').remove()" style="
                        background: linear-gradient(90deg, #4ecdc4, #44a08d);
                        color: #1a1a2e;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                        transition: transform 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Accept Quest
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(questWindow);
        
        // Auto-remove after 10 seconds if not closed
        setTimeout(() => {
            if (document.getElementById('quest-window')) {
                document.getElementById('quest-window').remove();
            }
        }, 10000);
    }

    // Add an item to the system
    addItem(item) {
        this.items.set(item.id, item);
    }

    // Get an item by ID
    getItem(itemId) {
        return this.items.get(itemId);
    }

    // Add item to player inventory
    addToInventory(itemId, quantity = 1) {
        console.log(`🎒 addToInventory called with itemId: ${itemId}, quantity: ${quantity}`);
        const item = this.getItem(itemId);
        if (!item) {
            console.log(`❌ Item ${itemId} not found!`);
            console.log(`❌ Available items:`, Array.from(this.items.keys()));
            return false;
        }
        console.log(`🎒 Found item:`, item);

        const existingItem = this.playerInventory.find(invItem => invItem.id === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.playerInventory.push({
                id: itemId,
                quantity: quantity,
                equipped: false
            });
        }

        console.log(`📦 Added ${quantity}x ${item.name} to inventory!`);
        console.log('🎒 Current inventory after adding:', this.playerInventory);
        this.savePlayerInventory();
        
        // Update UI inventory panel
        try {
            console.log('🎒 Attempting to update UI inventory panel...');
            if (window.UIPanels && window.UIPanels.populateInventoryPanel) {
                console.log('🎒 Calling populateInventoryPanel...');
                window.UIPanels.populateInventoryPanel();
                console.log('🎒 populateInventoryPanel called successfully');
            } else {
                console.warn('🎒 UIPanels or populateInventoryPanel not available');
            }
        } catch (e) {
            console.error('🎒 Error updating UI inventory panel:', e);
        }
        
        return true;
    }

    // Remove item from player inventory
    removeFromInventory(itemId, quantity = 1) {
        const existingItem = this.playerInventory.find(invItem => invItem.id === itemId);
        if (!existingItem) {
            console.log(`❌ Item ${itemId} not in inventory!`);
            return false;
        }

        if (existingItem.quantity <= quantity) {
            this.playerInventory = this.playerInventory.filter(invItem => invItem.id !== itemId);
            // Unequip if it was equipped
            if (existingItem.equipped) {
                this.unequipItem(itemId);
            }
        } else {
            existingItem.quantity -= quantity;
        }

        console.log(`📦 Removed ${quantity}x ${itemId} from inventory!`);
        this.savePlayerInventory();
        return true;
    }

    // Equip an item
    equipItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            console.log(`❌ Item ${itemId} not found!`);
            return false;
        }

        const inventoryItem = this.playerInventory.find(invItem => invItem.id === itemId);
        if (!inventoryItem || inventoryItem.quantity <= 0) {
            console.log(`❌ Item ${itemId} not in inventory!`);
            return false;
        }

        // Unequip current item of same type
        if (this.equippedItems[item.type]) {
            this.unequipItem(this.equippedItems[item.type].id);
        }

        // Equip new item
        this.equippedItems[item.type] = item;
        inventoryItem.equipped = true;

        console.log(`⚔️ Equipped ${item.name}!`);
        this.savePlayerInventory();
        return true;
    }

    // Unequip an item
    unequipItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            console.log(`❌ Item ${itemId} not found!`);
            return false;
        }

        if (this.equippedItems[item.type] && this.equippedItems[item.type].id === itemId) {
            this.equippedItems[item.type] = null;
            
            const inventoryItem = this.playerInventory.find(invItem => invItem.id === itemId);
            if (inventoryItem) {
                inventoryItem.equipped = false;
            }

            console.log(`⚔️ Unequipped ${item.name}!`);
            this.savePlayerInventory();
            return true;
        }

        return false;
    }

    // Get equipped items
    getEquippedItems() {
        return this.equippedItems;
    }

    // Get player inventory
    getPlayerInventory() {
        return this.playerInventory;
    }

    // Calculate total stats from equipped items
    getTotalStats() {
        const stats = {
            attack: 0,
            defense: 0,
            sanityBonus: 0,
            effects: []
        };

        Object.values(this.equippedItems).forEach(item => {
            if (item) {
                stats.attack += item.stats.attack || 0;
                stats.defense += item.stats.defense || 0;
                stats.sanityBonus += item.stats.sanityBonus || 0;
                stats.effects.push(...(item.effects || []));
            }
        });

        return stats;
    }

    // Save player inventory to local storage
    savePlayerInventory() {
        const data = {
            inventory: this.playerInventory,
            equipped: this.equippedItems
        };
        localStorage.setItem('eldritch_inventory', JSON.stringify(data));
    }

    // Load player inventory from local storage
    loadPlayerInventory() {
        const data = localStorage.getItem('eldritch_inventory');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.playerInventory = parsed.inventory || [];
                this.equippedItems = parsed.equipped || {
                    weapon: null,
                    armor: null,
                    accessory: null
                };
                console.log('📦 Player inventory loaded!');
            } catch (error) {
                console.log('❌ Error loading inventory:', error);
                this.playerInventory = [];
                this.equippedItems = {
                    weapon: null,
                    armor: null,
                    accessory: null
                };
            }
        }
    }

    // Get items by category
    getItemsByCategory(category) {
        return Array.from(this.items.values()).filter(item => item.category === category);
    }

    // Get items by rarity
    getItemsByRarity(rarity) {
        return Array.from(this.items.values()).filter(item => item.rarity === rarity);
    }

    // Use a consumable item by ID
    useConsumable(itemId) {
        console.log(`🧪 ItemSystem.useConsumable called with: ${itemId}`);
        console.log(`🧪 ItemSystem instance:`, this);
        console.log(`🧪 Player inventory:`, this.playerInventory);
        
        const item = this.getItem(itemId);
        console.log(`🧪 Item found:`, item);
        if (!item || item.type !== 'consumable') {
            console.log(`🧪 Item not found or not consumable:`, item);
            return false;
        }
        
        const inv = this.playerInventory.find(i => i.id === itemId);
        console.log(`🧪 Inventory item:`, inv);
        if (!inv || inv.quantity <= 0) {
            console.log(`🧪 No inventory item or quantity 0:`, inv);
            return false;
        }
        
        const handler = this.consumableHandlers[itemId];
        console.log(`🧪 Handler found:`, !!handler);
        console.log(`🧪 Available handlers:`, Object.keys(this.consumableHandlers));
        
        const applied = handler ? handler(item) : false;
        console.log(`🧪 Handler applied:`, applied);
        
        if (applied) {
            this.removeFromInventory(itemId, 1);
            console.log(`🧪 Item removed from inventory`);
        }
        return applied;
    }

    // Search items by name or description
    searchItems(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.items.values()).filter(item => 
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.lore.toLowerCase().includes(lowerQuery)
        );
    }

    // Generate random loot based on rarity
    generateRandomLoot(encounterType = 'monster') {
        const lootTable = {
            monster: {
                common: ['rusty_sword', 'cosmic_robes', 'sanity_amulet'],
                uncommon: ['eldritch_club', 'cosmic_bow', 'void_ring', 'cosmic_compass'],
                rare: ['void_blade', 'void_armor'],
                epic: ['crystal_plate', 'reality_anchor'],
                legendary: ['reality_gun', 'tentacle_wand', 'void_pocket']
            },
            poi: {
                common: ['sanity_amulet', 'cosmic_compass'],
                uncommon: ['void_ring', 'cosmic_bow'],
                rare: ['void_armor', 'crystal_plate'],
                epic: ['reality_anchor'],
                legendary: ['tentacle_wand', 'void_pocket']
            }
        };

        const table = lootTable[encounterType] || lootTable.monster;
        const rarities = Object.keys(table);
        const weights = {
            common: 50,
            uncommon: 30,
            rare: 15,
            epic: 4,
            legendary: 1
        };

        // Weighted random selection
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (const rarity of rarities) {
            random -= weights[rarity];
            if (random <= 0) {
                const items = table[rarity];
                const randomItem = items[Math.floor(Math.random() * items.length)];
                return {
                    itemId: randomItem,
                    rarity: rarity,
                    item: this.getItem(randomItem)
                };
            }
        }

        // Fallback to common
        const commonItems = table.common;
        const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
        return {
            itemId: randomItem,
            rarity: 'common',
            item: this.getItem(randomItem)
        };
    }
    
    // Initialize the item system
    init() {
        console.log('🎒 Item system initialized');
        this.isInitialized = true;
    }
}

// Make it globally available
window.ItemSystem = ItemSystem;
