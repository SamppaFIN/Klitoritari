/**
 * Item System - Cosmic Arsenal Management
 * 
 * Manages weapons, armor, accessories, and eldritch artifacts
 * with dark but amusing Lovecraftian flavor
 */

class ItemSystem {
    constructor() {
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
            stats: { heal: 20 },
            effects: ['restore_health'],
            value: 25,
            weight: 0.1,
            lore: 'A reassuringly red liquid of unknown provenance.'
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
                const ps = window.encounterSystem?.playerStats;
                if (!ps) return false;
                const before = ps.health;
                ps.health = Math.min(ps.maxHealth, ps.health + (item.stats?.heal || 0));
                this.feedback(`+${ps.health - before} health`, 'success', 'playSuccess');
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
        const item = this.getItem(itemId);
        if (!item) {
            console.log(`❌ Item ${itemId} not found!`);
            return false;
        }

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
        this.savePlayerInventory();
        
        // Update UI inventory panel
        try {
            if (window.UIPanels && window.UIPanels.populateInventoryPanel) {
                window.UIPanels.populateInventoryPanel();
            }
        } catch (_) {}
        
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
        const item = this.getItem(itemId);
        if (!item || item.type !== 'consumable') return false;
        const inv = this.playerInventory.find(i => i.id === itemId);
        if (!inv || inv.quantity <= 0) return false;
        const handler = this.consumableHandlers[itemId];
        const applied = handler ? handler(item) : false;
        if (applied) {
            this.removeFromInventory(itemId, 1);
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
