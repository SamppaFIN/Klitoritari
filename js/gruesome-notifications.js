/**
 * Gruesome Notification System
 * Shows different levels of gruesome notifications for health/sanity loss
 */

class GruesomeNotifications {
    constructor() {
        this.notificationLevels = {
            health: {
                100: { name: 'Perfect Health', color: '#00ff00', icon: '💚' },
                90: { name: 'Slightly Bruised', color: '#90ff00', icon: '💛' },
                80: { name: 'Battered', color: '#ffff00', icon: '🟡' },
                70: { name: 'Bloodied', color: '#ff8000', icon: '🟠' },
                60: { name: 'Wounded', color: '#ff4000', icon: '🔴' },
                50: { name: 'Severely Injured', color: '#ff0000', icon: '🩸' },
                40: { name: 'Bleeding Heavily', color: '#cc0000', icon: '💉' },
                30: { name: 'Near Death', color: '#990000', icon: '💀' },
                20: { name: 'Dying', color: '#660000', icon: '☠️' },
                10: { name: 'Critical', color: '#330000', icon: '⚰️' },
                0: { name: 'DEAD', color: '#000000', icon: '💀' }
            },
            sanity: {
                100: { name: 'Perfect Sanity', color: '#00ffff', icon: '🧠' },
                90: { name: 'Slightly Confused', color: '#80ffff', icon: '🤔' },
                80: { name: 'Unsettled', color: '#00ccff', icon: '😕' },
                70: { name: 'Disturbed', color: '#0099ff', icon: '😰' },
                60: { name: 'Frightened', color: '#0066ff', icon: '😨' },
                50: { name: 'Terrified', color: '#0033ff', icon: '😱' },
                40: { name: 'Losing Mind', color: '#6600ff', icon: '🤯' },
                30: { name: 'Madness Creeps', color: '#9900ff', icon: '👹' },
                20: { name: 'Insane', color: '#cc00ff', icon: '👻' },
                10: { name: 'Completely Mad', color: '#ff00ff', icon: '👽' },
                0: { name: 'MADNESS', color: '#ff00cc', icon: '💀' }
            },
            info: {
                success: { name: 'Success', color: '#00ff00', icon: '✅' },
                warning: { name: 'Warning', color: '#ffaa00', icon: '⚠️' },
                error: { name: 'Error', color: '#ff0000', icon: '❌' },
                info: { name: 'Info', color: '#00aaff', icon: 'ℹ️' }
            }
        };
    }

    showHealthLoss(amount, newHealth) {
        const level = this.getLevel(newHealth, 'health');
        const message = this.getHealthMessage(amount, newHealth, level);
        this.showNotification(message, level, 'health');
    }

    showSanityLoss(amount, newSanity) {
        const level = this.getLevel(newSanity, 'sanity');
        const message = this.getSanityMessage(amount, newSanity, level);
        this.showNotification(message, level, 'sanity');
        
        // Play scream effect for significant sanity loss
        if (amount >= 20) {
            if (window.sanityDistortion) {
                window.sanityDistortion.playScreamEffect();
            }
        }
    }
    
    // Simple method for general notifications
    showGeneralNotification(message, level = 'info', type = 'info') {
        this.showNotification(message, level, type);
    }

    getLevel(value, type) {
        const levels = Object.keys(this.notificationLevels[type]).map(Number).sort((a, b) => b - a);
        for (const level of levels) {
            if (value >= level) {
                return level;
            }
        }
        return 0;
    }

    getHealthMessage(amount, newHealth, level) {
        const levelInfo = this.notificationLevels.health[level];
        const messages = {
            100: [`You feel perfectly healthy!`, `No damage taken.`],
            90: [`You feel a slight sting.`, `Minor bruising.`],
            80: [`You're getting battered!`, `Pain courses through your body.`],
            70: [`Blood starts to flow!`, `You're bleeding from multiple wounds.`],
            60: [`You're seriously wounded!`, `Blood pools around your feet.`],
            50: [`You're severely injured!`, `Your wounds are deep and painful.`],
            40: [`You're bleeding heavily!`, `Blood gushes from your wounds.`],
            30: [`You're near death!`, `Your vision blurs as blood loss takes its toll.`],
            20: [`You're dying!`, `Death's cold embrace approaches.`],
            10: [`You're critical!`, `Your life force is fading fast.`],
            0: [`YOU ARE DEAD!`, `Your soul has left your body.`]
        };
        
        const messageArray = messages[level] || [`Health: ${newHealth}`, `Lost ${amount} health`];
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    getSanityMessage(amount, newSanity, level) {
        const levelInfo = this.notificationLevels.sanity[level];
        const messages = {
            100: [`Your mind is clear and focused.`, `Perfect mental clarity.`],
            90: [`A slight confusion clouds your thoughts.`, `Something feels... off.`],
            80: [`You feel unsettled.`, `The world seems slightly wrong.`],
            70: [`Your mind is disturbed.`, `Reality feels less solid.`],
            60: [`Fear grips your heart!`, `Something is watching you.`],
            50: [`You're terrified!`, `The shadows move on their own.`],
            40: [`Your mind is fracturing!`, `You hear whispers in the void.`],
            30: [`Madness creeps into your soul!`, `The walls are breathing.`],
            20: [`You're going insane!`, `Reality is breaking apart.`],
            10: [`You're completely mad!`, `The universe is laughing at you.`],
            0: [`MADNESS CONSUMES YOU!`, `You have lost your mind completely.`]
        };
        
        const messageArray = messages[level] || [`Sanity: ${newSanity}`, `Lost ${amount} sanity`];
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    showNotification(message, level, type) {
        // Support object-style call: { type, title, message, duration }
        let titleText = '';
        let messageText = message;
        let notifType = type || 'info';
        let notifLevel = level;
        let durationMs = 2500;

        if (message && typeof message === 'object') {
            const opts = message;
            messageText = opts.message || '';
            titleText = opts.title || '';
            notifType = opts.type || 'info';
            notifLevel = typeof opts.level === 'number' ? opts.level : 100; // default top level
            durationMs = typeof opts.duration === 'number' ? opts.duration : 2500;
        }

        // Resolve level info safely
        const typeLevels = this.notificationLevels[notifType] || {};
        // Pick nearest defined level if exact not present
        let levelKey = notifLevel;
        if (!(levelKey in typeLevels)) {
            const keys = Object.keys(typeLevels).map(Number).sort((a,b)=>b-a);
            levelKey = keys.find(k => notifLevel >= k) ?? (keys[0] ?? 100);
        }
        const levelInfo = typeLevels[levelKey] || { name: 'Info', color: '#66ccff', icon: 'ℹ️' };
        
        const notification = document.createElement('div');
        notification.className = 'gruesome-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, ${levelInfo.color}20, ${levelInfo.color}40);
            border: 2px solid ${levelInfo.color};
            border-radius: 10px;
            padding: 15px 25px;
            color: ${levelInfo.color};
            font-weight: bold;
            font-size: 16px;
            text-shadow: 0 0 10px ${levelInfo.color};
            box-shadow: 0 0 20px ${levelInfo.color}40;
            z-index: 10000;
            animation: gruesomeSlideIn 0.5s ease-out;
        `;

        const titleHtml = titleText ? `<div style="font-size:18px;margin-bottom:6px;color:${levelInfo.color}">${levelInfo.icon} ${titleText}</div>` : '';
        notification.innerHTML = `
            ${titleHtml}
            <div>${messageText}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'gruesomeSlideOut 0.4s ease-in';
            setTimeout(() => notification.remove(), 400);
        }, durationMs);
    }

    // Special death notification
    showDeathNotification(cause) {
        const deathMessages = {
            'instant_death': '💀 INSTANT DEATH! 💀',
            'sanity_loss': '🧠 MIND DESTROYED! 🧠',
            'health_loss': '🩸 BLEEDING OUT! 🩸',
            'cthulhu': '🐙 CONSUMED BY CTHULHU! 🐙',
            'troll': '👹 TROLL FOOD! 👹',
            'lake': '🌊 DISSOLVED IN THE LAKE! 🌊'
        };
        
        const message = deathMessages[cause] || '💀 YOU DIED! 💀';
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #000000, #330000);
            border: 3px solid #ff0000;
            border-radius: 20px;
            padding: 30px 50px;
            color: #ff0000;
            font-weight: bold;
            font-size: 32px;
            text-shadow: 0 0 20px #ff0000;
            box-shadow: 0 0 50px #ff0000;
            z-index: 10001;
            animation: deathPulse 1s ease-in-out infinite;
            text-align: center;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add death animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes deathPulse {
                0%, 100% { 
                    transform: translate(-50%, -50%) scale(1); 
                    box-shadow: 0 0 50px #ff0000;
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.1); 
                    box-shadow: 0 0 80px #ff0000;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);
    }
}

// Make globally available
window.GruesomeNotifications = GruesomeNotifications;
