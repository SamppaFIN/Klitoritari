/**
 * Quest Log UI - Visual interface for quest management and lore journal
 * Handles quest tracking, lore entries, and mystery investigation
 */

class QuestLogUI {
    constructor() {
        this.isInitialized = false;
        this.currentTab = 'active-quests';
        this.quests = [];
        this.loreEntries = [];
        this.mysteries = [];
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('ðŸ“œ Initializing Quest Log UI...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize sample data
        this.initializeSampleData();
        
        // Initial render
        this.updateQuestLog();
        
        this.isInitialized = true;
        console.log('ðŸ“œ Quest Log UI initialized!');
    }

    setupEventListeners() {
        // Quest log button
        const questLogBtn = document.getElementById('quest-log-btn');
        if (questLogBtn) {
            questLogBtn.addEventListener('click', () => this.toggleQuestLog());
        }

        // Close quest log
        const closeBtn = document.getElementById('close-quest-log');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideQuestLog());
        }

        // Tab switching
        const tabs = document.querySelectorAll('.quest-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Close on outside click
        const modal = document.getElementById('quest-log-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideQuestLog();
                }
            });
        }
    }

    toggleQuestLog() {
        const modal = document.getElementById('quest-log-modal');
        if (modal) {
            if (modal.classList.contains('hidden')) {
                this.showQuestLog();
            } else {
                this.hideQuestLog();
            }
        }
    }

    showQuestLog() {
        const modal = document.getElementById('quest-log-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateQuestLog();
        }
    }

    hideQuestLog() {
        const modal = document.getElementById('quest-log-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.quest-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.quest-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Update content based on tab
        switch (tabName) {
            case 'active-quests':
                this.updateActiveQuests();
                break;
            case 'completed-quests':
                this.updateCompletedQuests();
                break;
            case 'lore-journal':
                this.updateLoreJournal();
                break;
            case 'mysteries':
                this.updateMysteries();
                break;
        }
    }

    initializeSampleData() {
        // Sample active quests
        this.quests = [
            {
                id: 'harmala-mystery-1',
                title: 'The HÃ¤rmÃ¤lÃ¤ Mystery',
                type: 'main',
                description: 'Investigate the mysterious disappearances in the HÃ¤rmÃ¤lÃ¤ area. Something dark lurks beneath the surface of this seemingly peaceful region. The local mining town was abandoned after a massive sinkhole appeared in 1987, but recent reports suggest the area is still active with strange phenomena.',
                objectives: [
                    { id: 'explore-harmala', text: 'Explore the HÃ¤rmÃ¤lÃ¤ area and map the region', completed: false, progress: 0, max: 5 },
                    { id: 'find-clues', text: 'Find clues about the disappearances', completed: false, progress: 0, max: 3 },
                    { id: 'interview-witnesses', text: 'Interview local witnesses and survivors', completed: false, progress: 0, max: 2 },
                    { id: 'investigate-sites', text: 'Investigate suspicious locations', completed: false, progress: 0, max: 4 },
                    { id: 'examine-sinkhole', text: 'Examine the mysterious sinkhole', completed: false },
                    { id: 'collect-evidence', text: 'Collect physical evidence of cosmic activity', completed: false, progress: 0, max: 3 }
                ],
                rewards: [
                    { type: 'experience', value: 1000 },
                    { type: 'steps', value: 500 },
                    { type: 'item', value: 'reality_anchor' },
                    { type: 'lore', value: 'harmala-entity' }
                ],
                progress: 0,
                status: 'active',
                difficulty: 'hard',
                story: 'The HÃ¤rmÃ¤lÃ¤ Mystery is the central storyline of your cosmic investigation. This small mining town was once prosperous until the Great Collapse of 1987, when a massive sinkhole appeared overnight, swallowing half the town. The survivors spoke of strange lights and sounds coming from the depths, but their stories were dismissed as trauma-induced hallucinations. Now, 37 years later, new disappearances have begun, and the cosmic entities that once lurked in the shadows are becoming more active.'
            },
            {
                id: 'cosmic-exploration-1',
                title: 'Cosmic Explorer',
                type: 'side',
                description: 'Discover new locations and expand your cosmic knowledge. The universe is vast and full of mysteries waiting to be uncovered.',
                objectives: [
                    { id: 'visit-locations', text: 'Visit 10 different locations', completed: false, progress: 3, max: 10 },
                    { id: 'collect-lore', text: 'Collect 5 lore entries', completed: false, progress: 2, max: 5 },
                    { id: 'defeat-monsters', text: 'Defeat 5 cosmic entities', completed: false, progress: 1, max: 5 }
                ],
                rewards: [
                    { type: 'experience', value: 300 },
                    { type: 'item', value: 'cosmic_compass' }
                ],
                progress: 20,
                status: 'active'
            }
        ];

        // Sample lore entries
        this.loreEntries = [
            {
                id: 'harmala-history',
                title: 'The History of HÃ¤rmÃ¤lÃ¤',
                content: 'HÃ¤rmÃ¤lÃ¤ was once a thriving mining town, known for its rich deposits of cosmic crystals. The town prospered for decades until the Great Collapse of 1987, when a massive sinkhole appeared overnight, swallowing half the town. The survivors spoke of strange lights and sounds coming from the depths, but their stories were dismissed as trauma-induced hallucinations. The mining company, Cosmic Crystals Inc., abandoned the site and covered up the incident, claiming it was a natural geological event.',
                source: 'Local History Archives',
                tags: ['history', 'harmala', 'mining', 'collapse'],
                discovered: true
            },
            {
                id: 'great-collapse',
                title: 'The Great Collapse of 1987',
                content: 'On the night of October 31st, 1987, a massive sinkhole appeared in the center of HÃ¤rmÃ¤lÃ¤, swallowing 47 buildings and 23 people. The sinkhole was perfectly circular, 200 meters in diameter, and seemed to extend into infinite darkness. Rescue attempts were abandoned after the first team disappeared without a trace. The government declared the area a "geological hazard zone" and evacuated all remaining residents within a 5-kilometer radius.',
                source: 'Emergency Services Report #1987-1031',
                tags: ['harmala', 'collapse', 'disappearances', 'sinkhole'],
                discovered: false
            },
            {
                id: 'cosmic-crystals',
                title: 'Cosmic Crystals and Their Properties',
                content: 'Cosmic crystals are rare minerals that form in areas where the fabric of reality is thin. They possess unique properties that can bend space and time, making them highly sought after by both scientists and cultists. The crystals found in HÃ¤rmÃ¤lÃ¤ were particularly pure, which may explain the unusual phenomena reported in the area. Recent studies suggest these crystals may be fragments of a larger cosmic entity that slumbers beneath the earth.',
                source: 'Scientific Journal of Cosmic Phenomena',
                tags: ['science', 'crystals', 'reality', 'harmala'],
                discovered: true
            },
            {
                id: 'survivor-testimonies',
                title: 'Survivor Testimonies from the Great Collapse',
                content: 'The few survivors who witnessed the Great Collapse reported seeing "things that should not exist" emerging from the sinkhole. They described tentacled entities with too many eyes, creatures that moved in ways that defied physics, and a deep, otherworldly humming that seemed to come from everywhere and nowhere at once. One survivor, Maria Koskinen, claimed to have seen her missing husband walking towards the sinkhole, but when she called out to him, he turned around and his face was completely blank - no eyes, no mouth, just smooth skin.',
                source: 'Psychological Evaluation Reports, 1987-1988',
                tags: ['testimonies', 'survivors', 'entities', 'harmala'],
                discovered: false
            },
            {
                id: 'recent-disappearances',
                title: 'Recent Disappearances in the HÃ¤rmÃ¤lÃ¤ Area',
                content: 'Since 2020, there have been 12 new disappearances in the HÃ¤rmÃ¤lÃ¤ area. All victims were between 25-45 years old, and all disappearances occurred during the full moon. The pattern is eerily similar to the original Great Collapse, but on a smaller scale. Local authorities have been unable to find any physical evidence, and the disappearances have been officially classified as "unsolved missing persons cases." However, unofficial reports suggest that strange lights and sounds have been observed in the area again.',
                source: 'Police Reports, 2020-2024',
                tags: ['disappearances', 'harmala', 'recent', 'pattern'],
                discovered: false
            },
            {
                id: 'eldritch-entities',
                title: 'Eldritch Entities and Their Motivations',
                content: 'Eldritch entities are cosmic beings that exist beyond human comprehension. They are not inherently evil, but their very presence can drive mortals to madness. Some seek to understand humanity, while others view us as insignificant specks in the cosmic void. The entity in HÃ¤rmÃ¤lÃ¤ appears to be of the latter variety.',
                source: 'The Necronomicon (Excerpt)',
                tags: ['entities', 'eldritch', 'cosmic', 'madness'],
                discovered: false
            }
        ];

        // Sample mysteries
        this.mysteries = [
            {
                id: 'harmala-disappearances',
                title: 'The HÃ¤rmÃ¤lÃ¤ Disappearances',
                description: 'Over the past four years, 12 people have vanished without a trace in the HÃ¤rmÃ¤lÃ¤ area. All disappearances occurred during the full moon, and witnesses report seeing strange lights and hearing otherworldly sounds. The pattern suggests the cosmic entity that caused the Great Collapse of 1987 is becoming active again.',
                clues: [
                    'All disappearances occurred during full moon',
                    'Witnesses report strange lights in the sky',
                    'No physical evidence found at disappearance sites',
                    'Victims were all between 25-45 years old',
                    'Last known locations were near the old mine entrance',
                    'Survivors report seeing "blank-faced people" before disappearances',
                    'Strange humming sounds heard in the area',
                    'Animals avoid the sinkhole area completely'
                ],
                progress: 40,
                difficulty: 'hard',
                status: 'investigating',
                story: 'The HÃ¤rmÃ¤lÃ¤ Disappearances represent the resurgence of cosmic activity in the area. After 37 years of relative quiet, something has awakened beneath the earth, and it\'s hungry. The pattern of disappearances suggests a deliberate, almost ritualistic selection process, as if the entity is choosing its victims based on some unknown criteria.'
            },
            {
                id: 'cosmic-disturbances',
                title: 'Cosmic Disturbances in the Area',
                description: 'Local residents report experiencing time distortions, memory lapses, and vivid nightmares. These phenomena seem to be concentrated around the old mining area and are becoming more frequent.',
                clues: [
                    'Time appears to move differently in certain areas',
                    'Residents report missing hours or days',
                    'Nightmares feature similar imagery',
                    'Disturbances increase during cosmic events',
                    'Animals avoid the affected areas',
                    'Electronic devices malfunction near the sinkhole',
                    'People report hearing voices calling their names'
                ],
                progress: 25,
                difficulty: 'medium',
                status: 'investigating',
                story: 'The cosmic disturbances are a side effect of the entity\'s growing influence. As it awakens, its presence warps the very fabric of reality around it, causing time to flow differently and memories to become unreliable. The nightmares are not just dreams - they are glimpses into the entity\'s mind, and they are getting stronger.'
            },
            {
                id: 'the-entity-beneath',
                title: 'The Entity Beneath HÃ¤rmÃ¤lÃ¤',
                description: 'Something ancient and powerful slumbers beneath the HÃ¤rmÃ¤lÃ¤ sinkhole. The cosmic crystals were not just minerals - they were fragments of this entity, and the mining operations may have awakened it. Now it stirs, and its dreams are becoming reality.',
                clues: [
                    'The sinkhole extends far deeper than geologically possible',
                    'Cosmic crystals are fragments of a larger being',
                    'The entity communicates through dreams and visions',
                    'It has been dormant for thousands of years',
                    'The Great Collapse was its first attempt to surface',
                    'It feeds on human consciousness and memories',
                    'The disappearances are part of a larger plan'
                ],
                progress: 10,
                difficulty: 'legendary',
                status: 'investigating',
                story: 'The Entity Beneath HÃ¤rmÃ¤lÃ¤ is the central mystery of your investigation. This ancient cosmic being has been slumbering beneath the earth for millennia, but the mining operations and the extraction of cosmic crystals have disturbed its rest. Now it awakens, and it seeks to reclaim what was taken from it. The disappearances are not random - they are the entity\'s way of gathering the consciousness it needs to fully manifest in our world.'
            }
        ];
    }

    updateQuestLog() {
        this.updateActiveQuests();
        this.updateCompletedQuests();
        this.updateLoreJournal();
        this.updateMysteries();
    }

    updateActiveQuests() {
        const container = document.getElementById('active-quest-list');
        if (!container) return;

        const activeQuests = this.quests.filter(quest => quest.status === 'active');
        
        if (activeQuests.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No active quests. Go explore to find new adventures!</div>';
            return;
        }

        container.innerHTML = activeQuests.map(quest => this.createQuestElement(quest)).join('');
    }

    updateCompletedQuests() {
        const container = document.getElementById('completed-quest-list');
        if (!container) return;

        const completedQuests = this.quests.filter(quest => quest.status === 'completed');
        
        if (completedQuests.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No completed quests yet. Complete some quests to see them here!</div>';
            return;
        }

        container.innerHTML = completedQuests.map(quest => this.createQuestElement(quest)).join('');
    }

    updateLoreJournal() {
        const container = document.getElementById('lore-entries');
        if (!container) return;

        const discoveredLore = this.loreEntries.filter(entry => entry.discovered);
        
        if (discoveredLore.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No lore discovered yet. Explore and investigate to uncover cosmic knowledge!</div>';
            return;
        }

        container.innerHTML = discoveredLore.map(entry => this.createLoreElement(entry)).join('');
    }

    updateMysteries() {
        const container = document.getElementById('mystery-list');
        if (!container) return;

        if (this.mysteries.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No mysteries to investigate yet. Keep exploring to uncover cosmic secrets!</div>';
            return;
        }

        container.innerHTML = this.mysteries.map(mystery => this.createMysteryElement(mystery)).join('');
    }

    createQuestElement(quest) {
        const progressPercentage = quest.progress || 0;
        const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
        const totalObjectives = quest.objectives.length;

        return `
            <div class="quest-item ${quest.status}">
                <div class="quest-header">
                    <h3 class="quest-title">${quest.title}</h3>
                    <span class="quest-type">${quest.type}</span>
                </div>
                <div class="quest-description">${quest.description}</div>
                
                <div class="quest-objectives">
                    ${quest.objectives.map(objective => `
                        <div class="objective-item">
                            <input type="checkbox" class="objective-checkbox" ${objective.completed ? 'checked' : ''} 
                                   onchange="window.questLogUI.toggleObjective('${quest.id}', '${objective.id}')">
                            <span class="objective-text ${objective.completed ? 'completed' : ''}">${objective.text}</span>
                            ${objective.progress ? `<span style="color: #ff9800; margin-left: 10px;">(${objective.progress}/${objective.max})</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="quest-progress">
                    <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                </div>
                
                <div class="quest-rewards">
                    ${quest.rewards.map(reward => `
                        <span class="reward-item">${reward.type}: ${reward.value}</span>
                    `).join('')}
                </div>
                
                <div class="quest-actions">
                    <button class="quest-btn" onclick="window.questLogUI.abandonQuest('${quest.id}')">Abandon</button>
                    ${quest.status === 'active' ? '' : '<button class="quest-btn secondary" onclick="window.questLogUI.restartQuest(\'' + quest.id + '\')">Restart</button>'}
                </div>
            </div>
        `;
    }

    createLoreElement(entry) {
        return `
            <div class="lore-entry">
                <h3 class="lore-title">${entry.title}</h3>
                <div class="lore-content">${entry.content}</div>
                <div class="lore-source">Source: ${entry.source}</div>
                <div class="lore-tags">
                    ${entry.tags.map(tag => `<span class="lore-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    createMysteryElement(mystery) {
        return `
            <div class="mystery-item">
                <h3 class="mystery-title">${mystery.title}</h3>
                <div class="mystery-description">${mystery.description}</div>
                
                <div class="mystery-clues">
                    <h4 style="color: #ff9800; margin-bottom: 10px;">Clues Discovered:</h4>
                    ${mystery.clues.map(clue => `<div class="clue-item">${clue}</div>`).join('')}
                </div>
                
                <div class="mystery-status">
                    <span class="mystery-progress">Progress: ${mystery.progress}%</span>
                    <span class="mystery-difficulty ${mystery.difficulty}">${mystery.difficulty}</span>
                </div>
            </div>
        `;
    }

    toggleObjective(questId, objectiveId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest) return;

        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return;

        objective.completed = !objective.completed;
        
        // Update quest progress
        const completedCount = quest.objectives.filter(obj => obj.completed).length;
        quest.progress = Math.round((completedCount / quest.objectives.length) * 100);
        
        // Check if quest is completed
        if (completedCount === quest.objectives.length) {
            this.completeQuest(questId);
        }
        
        this.updateQuestLog();
    }

    completeQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest) return;

        quest.status = 'completed';
        
        // Apply rewards
        quest.rewards.forEach(reward => {
            switch (reward.type) {
                case 'experience':
                    if (window.encounterSystem) {
                        window.encounterSystem.gainExperience(reward.value, `Quest completed: ${quest.title}`);
                    }
                    break;
                case 'steps':
                    if (window.encounterSystem) {
                        window.encounterSystem.playerSteps += reward.value;
                        window.encounterSystem.updateStatBars();
                    }
                    break;
                case 'item':
                    if (window.encounterSystem?.itemSystem) {
                        window.encounterSystem.itemSystem.addToInventory(reward.value, 1);
                    }
                    break;
            }
        });

        this.showNotification(`Quest completed: ${quest.title}!`, 'success');
        this.updateQuestLog();
    }

    abandonQuest(questId) {
        if (confirm('Are you sure you want to abandon this quest?')) {
            const quest = this.quests.find(q => q.id === questId);
            if (quest) {
                quest.status = 'abandoned';
                this.updateQuestLog();
            }
        }
    }

    restartQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest) {
            quest.status = 'active';
            quest.objectives.forEach(obj => obj.completed = false);
            quest.progress = 0;
            this.updateQuestLog();
        }
    }

    addLoreEntry(entry) {
        this.loreEntries.push(entry);
        this.updateLoreJournal();
    }

    addMystery(mystery) {
        this.mysteries.push(mystery);
        this.updateMysteries();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Make it globally available
window.QuestLogUI = QuestLogUI;


