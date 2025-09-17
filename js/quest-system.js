/**
 * Quest System - Cosmic Mystery Management
 * 
 * Manages the Härmälä Mystery Arc and other cosmic quests
 * with dark but amusing Lovecraftian storytelling
 */

class QuestSystem {
    constructor() {
        this.activeQuests = [];
        this.completedQuests = [];
        this.questDatabase = new Map();
        this.currentMainQuest = null;
        this.questProgress = {};
        
        this.initializeQuests();
        this.loadQuestProgress();
    }

    // Initialize all quests in the cosmic realm
    initializeQuests() {
        // Main Quest: The Härmälä Convergence
        this.addQuest({
            id: 'harmala_convergence',
            name: 'The Härmälä Convergence',
            type: 'main',
            status: 'available',
            description: 'Something ancient stirs beneath the streets of Härmälä. The cosmic entities whisper of a convergence that will reshape reality itself... or at least the local bus schedule.',
            objectives: [
                {
                    id: 'investigate_anomalies',
                    description: 'Investigate the cosmic anomalies appearing around Härmälä',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 5,
                    type: 'encounter'
                },
                {
                    id: 'gather_artifacts',
                    description: 'Collect eldritch artifacts from the convergence points',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 3,
                    type: 'collect'
                },
                {
                    id: 'uncover_truth',
                    description: 'Uncover the truth behind the Härmälä Mystery',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'discover'
                }
            ],
            rewards: {
                experience: 1000,
                items: ['reality_anchor', 'void_pocket'],
                title: 'Härmälä Mystery Solver'
            },
            story: {
                intro: 'The cosmic entities have been unusually chatty lately, and they all seem to be talking about Härmälä. Apparently, something big is about to happen there, and they want you to be involved. How flattering.',
                progress: [
                    'The anomalies are getting stronger. The local cats have started speaking in ancient tongues, and the bus drivers are reporting "dimensional delays."',
                    'You\'ve found the first artifact - a crystal that hums with cosmic energy. It\'s also quite good at keeping time, which is helpful since the local clocks have started running backwards.',
                    'The truth is becoming clearer. The convergence isn\'t just happening in Härmälä - it\'s happening everywhere, but Härmälä is the focal point. The cosmic entities are using it as a cosmic magnifying glass to... well, that part is still unclear.'
                ],
                completion: 'You\'ve solved the Härmälä Mystery! The convergence was actually a cosmic prank orchestrated by the Void Entities to see how mortals would react to reality being slightly... flexible. They\'re quite pleased with your performance and have offered you a job as their cosmic consultant.'
            }
        });

        // Side Quest: The Cosmic Librarian
        this.addQuest({
            id: 'cosmic_librarian',
            name: 'The Cosmic Librarian\'s Dilemma',
            type: 'side',
            status: 'available',
            description: 'A cosmic librarian has lost their favorite book and needs your help finding it. The book is apparently quite important - it contains the recipe for cosmic cookies.',
            objectives: [
                {
                    id: 'find_librarian',
                    description: 'Locate the Cosmic Librarian in the void between dimensions',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'find'
                },
                {
                    id: 'search_void',
                    description: 'Search the void for the missing book',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 5,
                    type: 'explore'
                },
                {
                    id: 'return_book',
                    description: 'Return the book to the grateful librarian',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'deliver'
                }
            ],
            rewards: {
                experience: 500,
                items: ['cosmic_cookie_recipe'],
                title: 'Void Librarian\'s Assistant'
            },
            story: {
                intro: 'You encounter a cosmic librarian floating in the void, looking quite distressed. "I\'ve lost my favorite book!" they wail. "It contains the recipe for cosmic cookies, and without it, the entire cosmic tea party is ruined!"',
                progress: [
                    'The librarian is very specific about what the book looks like: "It\'s bound in starlight and smells like old knowledge." You\'re not entirely sure what that means, but you\'ll figure it out.',
                    'You\'ve found several books in the void, but none of them smell quite right. The librarian is getting impatient, and you\'re starting to think this might be a cosmic wild goose chase.',
                    'Success! You\'ve found the book. It\'s exactly as described - bound in starlight and smelling like old knowledge. The librarian is overjoyed and offers you a cosmic cookie as a reward.'
                ],
                completion: 'The cosmic librarian is eternally grateful and has given you the recipe for cosmic cookies. They taste like starlight and make you slightly more intelligent for about an hour. The cosmic tea party is saved!'
            }
        });

        // Side Quest: The Void Walker's Keys
        this.addQuest({
            id: 'void_walker_keys',
            name: 'The Void Walker\'s Lost Keys',
            type: 'side',
            status: 'available',
            description: 'The Void Walker has been looking for their keys for 12 eons and is getting quite frustrated. Help them find their keys before they accidentally walk into the wrong dimension.',
            objectives: [
                {
                    id: 'talk_to_walker',
                    description: 'Speak with the Void Walker about their missing keys',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'talk'
                },
                {
                    id: 'search_dimensions',
                    description: 'Search various dimensions for the missing keys',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 7,
                    type: 'explore'
                },
                {
                    id: 'return_keys',
                    description: 'Return the keys to the grateful Void Walker',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'deliver'
                }
            ],
            rewards: {
                experience: 750,
                items: ['dimensional_keyring'],
                title: 'Void Walker\'s Friend'
            },
            story: {
                intro: 'The Void Walker approaches you with a look of desperation. "I\'ve been looking for my keys for 12 eons!" they exclaim. "I know I left them somewhere, but I can\'t remember where. Can you help me find them?"',
                progress: [
                    'The Void Walker is very specific about what the keys look like: "They\'re made of void metal and jingle when you shake them." You\'re starting to think this might be more difficult than it sounds.',
                    'You\'ve searched several dimensions, but the keys remain elusive. The Void Walker is getting more frustrated by the day, and you\'re starting to think they might have left them in a dimension that no longer exists.',
                    'Eureka! You\'ve found the keys in the 47th dimension, right where the Void Walker left them 12 eons ago. They\'re exactly as described - made of void metal and jingling merrily.',
                    'The Void Walker is overjoyed and gives you a dimensional keyring as a reward. It allows you to open doors between dimensions, which is both useful and slightly terrifying.'
                ],
                completion: 'The Void Walker is eternally grateful and has given you a dimensional keyring. It allows you to open doors between dimensions, which is both useful and slightly terrifying. The Void Walker can finally go home!'
            }
        });

        // Side Quest: The Cosmic Beast's Book Club
        this.addQuest({
            id: 'cosmic_book_club',
            name: 'The Cosmic Beast\'s Book Club',
            type: 'side',
            status: 'available',
            description: 'The Cosmic Beast wants to start a book club but can\'t find anyone to join. Help them recruit members and organize the first meeting.',
            objectives: [
                {
                    id: 'recruit_members',
                    description: 'Recruit cosmic entities to join the book club',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 5,
                    type: 'recruit'
                },
                {
                    id: 'choose_book',
                    description: 'Help choose the first book for the club',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'choose'
                },
                {
                    id: 'organize_meeting',
                    description: 'Organize the first book club meeting',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'organize'
                }
            ],
            rewards: {
                experience: 600,
                items: ['cosmic_poetry_anthology', 'book_club_membership'],
                title: 'Cosmic Book Club Founder'
            },
            story: {
                intro: 'The Cosmic Beast approaches you with a look of hope. "I\'ve been trying to start a book club for eons, but no one ever shows up to the meetings," they say. "Can you help me recruit some members?"',
                progress: [
                    'You\'ve started recruiting cosmic entities for the book club. The Shadow Stalker is interested but wants to know if they can bring their own snacks.',
                    'You\'ve chosen the first book: "The Cosmic Horror of Being a Cosmic Entity" by an anonymous author. It\'s quite popular among the cosmic community.',
                    'The first book club meeting is a success! The Cosmic Beast is overjoyed, and the members are already discussing the next book. The club is officially established.'
                ],
                completion: 'The Cosmic Beast\'s book club is now thriving! You\'ve been given a lifetime membership and a copy of the cosmic poetry anthology. The club meets every cosmic cycle to discuss the latest in cosmic literature.'
            }
        });

        // Side Quest: The Reality Gun's Legal Team
        this.addQuest({
            id: 'reality_gun_legal',
            name: 'The Reality Gun\'s Legal Team',
            type: 'side',
            status: 'available',
            description: 'The Reality Gun has gotten itself into legal trouble for shooting holes in reality without proper permits. Help its legal team resolve the case.',
            objectives: [
                {
                    id: 'meet_legal_team',
                    description: 'Meet with the Reality Gun\'s legal team',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'meet'
                },
                {
                    id: 'gather_evidence',
                    description: 'Gather evidence to support the Reality Gun\'s case',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 3,
                    type: 'gather'
                },
                {
                    id: 'attend_hearing',
                    description: 'Attend the cosmic court hearing',
                    status: 'incomplete',
                    progress: 0,
                    maxProgress: 1,
                    type: 'attend'
                }
            ],
            rewards: {
                experience: 800,
                items: ['cosmic_law_degree', 'reality_gun_license'],
                title: 'Cosmic Legal Advocate'
            },
            story: {
                intro: 'You encounter the Reality Gun\'s legal team, a group of cosmic lawyers who specialize in dimensional law. "We need your help," they say. "The Reality Gun is facing charges for shooting holes in reality without proper permits."',
                progress: [
                    'The legal team explains the charges: "Shooting holes in reality without proper permits is a serious offense in the cosmic realm. We need evidence that the Reality Gun was acting in self-defense."',
                    'You\'ve gathered evidence that the Reality Gun was only shooting holes in reality to defend against cosmic threats. The legal team is confident this will help their case.',
                    'The cosmic court hearing is intense, but your evidence is compelling. The Reality Gun is acquitted of all charges and given a proper license to shoot holes in reality.'
                ],
                completion: 'The Reality Gun is acquitted of all charges and given a proper license to shoot holes in reality. You\'ve been awarded a cosmic law degree and are now considered a legal advocate in the cosmic realm.'
            }
        });
    }

    // Add a quest to the database
    addQuest(quest) {
        this.questDatabase.set(quest.id, quest);
    }

    // Get a quest by ID
    getQuest(questId) {
        return this.questDatabase.get(questId);
    }

    // Start a quest
    startQuest(questId) {
        const quest = this.getQuest(questId);
        if (!quest) {
            console.log(`❌ Quest ${questId} not found!`);
            return false;
        }

        if (quest.status !== 'available') {
            console.log(`❌ Quest ${questId} is not available!`);
            return false;
        }

        quest.status = 'active';
        this.activeQuests.push(quest);
        this.questProgress[questId] = {};

        console.log(`📜 Quest started: ${quest.name}`);
        this.showQuestNotification(`Quest Started: ${quest.name}`, quest.description);
        this.saveQuestProgress();
        return true;
    }

    // Complete a quest
    completeQuest(questId) {
        const quest = this.getQuest(questId);
        if (!quest) {
            console.log(`❌ Quest ${questId} not found!`);
            return false;
        }

        if (quest.status !== 'active') {
            console.log(`❌ Quest ${questId} is not active!`);
            return false;
        }

        quest.status = 'completed';
        this.activeQuests = this.activeQuests.filter(q => q.id !== questId);
        this.completedQuests.push(quest);

        // Give rewards
        this.giveQuestRewards(quest);

        console.log(`✅ Quest completed: ${quest.name}`);
        this.showQuestNotification(`Quest Completed: ${quest.name}`, quest.story.completion);
        this.saveQuestProgress();
        return true;
    }

    // Update quest progress
    updateQuestProgress(questId, objectiveId, amount = 1) {
        const quest = this.getQuest(questId);
        if (!quest || quest.status !== 'active') return false;

        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return false;

        objective.progress = Math.min(objective.progress + amount, objective.maxProgress);
        
        if (objective.progress >= objective.maxProgress) {
            objective.status = 'completed';
            console.log(`✅ Objective completed: ${objective.description}`);
        }

        // Check if quest is complete
        const allObjectivesComplete = quest.objectives.every(obj => obj.status === 'completed');
        if (allObjectivesComplete) {
            this.completeQuest(questId);
        }

        this.saveQuestProgress();
        return true;
    }

    // Give quest rewards
    giveQuestRewards(quest) {
        if (quest.rewards.experience) {
            // Add experience to player stats
            if (window.encounterSystem && window.encounterSystem.playerStats) {
                window.encounterSystem.playerStats.experience += quest.rewards.experience;
                console.log(`⭐ Gained ${quest.rewards.experience} experience!`);
            }
        }

        if (quest.rewards.items) {
            // Add items to inventory
            if (window.encounterSystem && window.encounterSystem.itemSystem) {
                quest.rewards.items.forEach(itemId => {
                    window.encounterSystem.itemSystem.addToInventory(itemId, 1);
                    console.log(`🎁 Received item: ${itemId}`);
                });
            }
        }

        if (quest.rewards.title) {
            console.log(`🏆 Earned title: ${quest.rewards.title}`);
        }
    }

    // Show quest notification
    showQuestNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'quest-notification';
        notification.innerHTML = `
            <div class="quest-notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Get available quests
    getAvailableQuests() {
        return Array.from(this.questDatabase.values()).filter(quest => quest.status === 'available');
    }

    // Get active quests
    getActiveQuests() {
        return this.activeQuests;
    }

    // Get completed quests
    getCompletedQuests() {
        return this.completedQuests;
    }

    // Save quest progress to local storage
    saveQuestProgress() {
        const data = {
            activeQuests: this.activeQuests.map(q => q.id),
            completedQuests: this.completedQuests.map(q => q.id),
            questProgress: this.questProgress
        };
        localStorage.setItem('eldritch_quests', JSON.stringify(data));
    }

    // Load quest progress from local storage
    loadQuestProgress() {
        const data = localStorage.getItem('eldritch_quests');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                
                // Restore quest statuses
                parsed.activeQuests.forEach(questId => {
                    const quest = this.getQuest(questId);
                    if (quest) {
                        quest.status = 'active';
                        this.activeQuests.push(quest);
                    }
                });
                
                parsed.completedQuests.forEach(questId => {
                    const quest = this.getQuest(questId);
                    if (quest) {
                        quest.status = 'completed';
                        this.completedQuests.push(quest);
                    }
                });
                
                this.questProgress = parsed.questProgress || {};
                console.log('📜 Quest progress loaded!');
            } catch (error) {
                console.log('❌ Error loading quest progress:', error);
            }
        }
    }

    // Start the main quest
    startMainQuest() {
        this.startQuest('harmala_convergence');
        this.currentMainQuest = 'harmala_convergence';
    }

    // Get quest by type
    getQuestsByType(type) {
        return Array.from(this.questDatabase.values()).filter(quest => quest.type === type);
    }

    // Get quest progress for display
    getQuestProgress(questId) {
        const quest = this.getQuest(questId);
        if (!quest) return null;

        const completedObjectives = quest.objectives.filter(obj => obj.status === 'completed').length;
        const totalObjectives = quest.objectives.length;
        const progressPercentage = Math.round((completedObjectives / totalObjectives) * 100);

        return {
            quest,
            completedObjectives,
            totalObjectives,
            progressPercentage
        };
    }
}

// Make it globally available
window.QuestSystem = QuestSystem;
