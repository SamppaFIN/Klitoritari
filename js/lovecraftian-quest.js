/**
 * Lovecraftian Quest System
 * A dark humorous narrative combining H.P. Lovecraft with Terry Pratchett
 */

class LovecraftianQuest {
    constructor() {
        this.questLocations = [
            {
                id: 'corroding_lake',
                name: 'The Fuming Lake of Despair',
                lat: 61.476173436868,
                lng: 23.725432936819306,
                description: 'A lake that shouldn\'t exist, fuming with otherworldly vapors',
                narrative: `The lake stretched before you like a vast, malevolent mirror reflecting not the sky above, but something far more disturbing—a sky from another dimension where the stars were wrong and the moon had too many eyes. The water itself was the color of a bruise that had gone septic, a deep purple-black that seemed to absorb light rather than reflect it. Bubbles rose from its depths with the regularity of a dying man's last breaths, each one releasing a vapor that made your eyes water and your nose burn with the acrid stench of cosmic decay.

The surface rippled with patterns that made no geometric sense, forming shapes that your mind desperately tried to interpret as mere optical illusions, but which your subconscious recognized as the written language of entities that existed before time itself. The very air around the lake seemed to thicken with malevolence, and you could swear you heard whispers in languages that had never been spoken by human tongues.

This was clearly not a place for swimming, unless you were a fish from the dimension of eternal suffering—and even then, you'd want to check the water quality first. The lake seemed to be waiting for something, or someone, and you had the distinct impression that it was considering whether you might make a suitable offering to whatever eldritch horror lurked in its depths.`,
                choices: [
                    {
                        text: 'Study the lake from a safe distance with scholarly curiosity',
                        consequence: 'sanity_loss',
                        amount: 20,
                        description: 'As you peer into the depths, your mind begins to unravel like a poorly knitted sweater. The patterns in the water start to make sense, and that sense is horrifying. You realize the lake is not just a body of water—it\'s a window into the cosmic void where sanity goes to die. Your brain, being the traitorous organ it is, decides to process this information anyway. You lose 20 sanity points, but at least you now understand why the fish have tentacles.'
                    },
                    {
                        text: 'Touch the water to test its properties like a proper scientist',
                        consequence: 'instant_death',
                        amount: 0,
                        description: 'In the grand tradition of scientific inquiry, you reach out to touch the mysterious liquid. The water, being rather more sentient than you anticipated, decides to return the favor by touching you back—with extreme prejudice. Your hand dissolves first, then your arm, then your soul, which turns out to be surprisingly soluble in eldritch lake water. You have died horribly, but at least you died with the spirit of scientific discovery. The lake burps contentedly.'
                    },
                    {
                        text: 'Flee immediately while covering your mouth and nose',
                        consequence: 'health_loss',
                        amount: 15,
                        description: 'You execute a tactical retreat that would make any military strategist proud, but the cosmic vapors are faster than your legs. They seep into your lungs like unwelcome houseguests who refuse to leave, setting up shop in your respiratory system and throwing a party that your alveoli definitely didn\'t consent to. You escape with your life, but your lungs now feel like they\'ve been scrubbed with sandpaper and lemon juice. You lose 15 health, but at least you\'re not dead. Small victories.'
                    }
                ]
            },
            {
                id: 'ancient_branch',
                name: 'The Twisted Path of Wrong Turns',
                lat: 61.473611708976755,
                lng: 23.73287872299121,
                description: 'A path that leads nowhere, but finds something useful',
                narrative: `The path you're following has developed a rather disturbing habit of not going where you think it should. It twists and turns like a snake with indigestion, leading you through a forest that seems to be made of equal parts wood, shadow, and existential dread. The trees here have faces—not carved faces, but actual faces that appear to be contemplating the meaning of life, the universe, and whether they should have invested in better retirement plans.

You realize you've taken a wrong turn, which in this particular reality means you've taken the right turn. The universe, it seems, has a sense of humor, and it's currently laughing at you with the kind of mirth that makes you question whether you should be laughing along or running for your life. The path has led you to a clearing where an ancient wooden branch lies, humming with eldritch energy and looking rather pleased with itself.

The branch is not just any branch—it's the kind of branch that has seen things, done things, and probably has opinions about the current state of cosmic affairs. It glows with a soft, otherworldly light that makes your teeth ache and your hair stand on end. It's clearly magical, and in your experience, magical things are either incredibly helpful or incredibly dangerous, with very little middle ground.`,
                choices: [
                    {
                        text: 'Pick up the branch and feel its power coursing through you',
                        consequence: 'item_gain',
                        amount: 0,
                        description: 'As your fingers close around the branch, a surge of ancient power courses through your body like electricity, if electricity were made of pure cosmic energy and had a sense of humor. The branch introduces itself as the Staff of Questionable Sanity, and it immediately begins whispering secrets that make your brain itch in ways you didn\'t know brains could itch. You gain a powerful weapon, but you also gain the distinct impression that the staff is judging your life choices. The staff seems pleased with its new owner, though whether that\'s a good thing remains to be seen.'
                    },
                    {
                        text: 'Leave the branch and continue searching for a safer path',
                        consequence: 'sanity_gain',
                        amount: 5,
                        description: 'You take a step back and consider the situation with the kind of wisdom that comes from having made too many bad decisions in the past. Sometimes the best weapon is not picking up the weapon, especially when the weapon is clearly sentient and has opinions about your fashion sense. You gain 5 sanity points for exercising restraint, though you can\'t shake the feeling that the branch is disappointed in you. It sighs audibly as you walk away, which is rather impressive for a piece of wood.'
                    }
                ]
            },
            {
                id: 'hilltop_sage',
                name: 'The Summit of Madness',
                lat: 61.47307885676524,
                lng: 23.732106061397662,
                description: 'A hill where sanity goes to die',
                narrative: `The hill rises before you like a monument to poor life choices, its slopes covered in vegetation that seems to be having an existential crisis. The trees here are bent and twisted, not by wind or weather, but by the weight of cosmic knowledge that no tree should have to bear. As you climb higher, the air itself seems to thicken with the kind of wisdom that makes your brain hurt and your soul question its life insurance policy.

At the summit, you encounter a figure that can only be described as a lunatic sage, though "lunatic" might be putting it mildly. He's wearing robes that appear to be made of starlight and bad decisions, and his beard is so long and tangled that it might actually be sentient. He introduces himself as the "Keeper of the Lake's Dreams," which sounds impressive until you realize that keeping track of a lake's dreams is probably not a job with good benefits or dental coverage.

The sage is either completely mad or completely sane, and both options are equally terrifying. His eyes hold the kind of knowledge that makes mortals go mad, but he also has the air of someone who's been waiting for a good conversation for several centuries and is getting rather desperate. He gestures toward the lake below with a hand that seems to have too many fingers, and you notice that his shadow doesn't quite match his movements.`,
                choices: [
                    {
                        text: 'Listen attentively to his purification spell',
                        consequence: 'spell_learned',
                        amount: 0,
                        description: 'The sage begins to chant in a language that sounds like wind through cosmic wind chimes, if wind chimes were made of pure mathematics and existential dread. As he speaks, the air around you begins to shimmer with otherworldly energy, and you feel the knowledge of the "Chant of Questionable Air Quality" being imprinted directly onto your soul. The spell might work, or it might summon something significantly worse than the original problem. The sage seems confident, but then again, he also seems to think that wearing a hat made of starlight is perfectly normal. You gain a powerful purification spell, though you\'re not entirely sure what it purifies or whether you want to know.'
                    },
                    {
                        text: 'Ask him about the lake\'s true nature and origins',
                        consequence: 'sanity_loss',
                        amount: 30,
                        description: 'The sage\'s eyes light up with the kind of enthusiasm that usually precedes a very long, very disturbing explanation. He tells you the truth about the lake—how it\'s not really a lake at all, but a wound in reality itself, a place where the fabric of space and time has been torn by forces beyond mortal comprehension. He explains how the lake is actually a prison for an ancient cosmic horror that was sealed away by beings so powerful they make gods look like particularly ambitious goldfish. You wish he hadn\'t told you. You really, really wish he hadn\'t told you. You lose 30 sanity points, but at least now you understand why the fish have tentacles and why the water tastes like despair.'
                    },
                    {
                        text: 'Try to reason with him about the futility of cosmic struggles',
                        consequence: 'sanity_gain',
                        amount: 10,
                        description: 'You sit down next to the sage and begin a philosophical discussion about the nature of existence, the futility of cosmic struggles, and whether it\'s really worth getting worked up about ancient horrors when there are more pressing matters like where to get a decent cup of tea in this dimension. The sage laughs—a sound like wind chimes made of pure joy—and agrees wholeheartedly. Sometimes acceptance is the only sanity, he says, and sometimes the best way to deal with cosmic horror is to have a good laugh about it. You gain 10 sanity points for finding a kindred spirit in this mad, mad universe.'
                    }
                ]
            },
            {
                id: 'hideous_troll',
                name: 'The Bridge of Regret',
                lat: 61.47668582005944,
                lng: 23.730389713506298,
                description: 'Where trolls go to contemplate their life choices',
                narrative: `The bridge stretches before you like a monument to poor engineering and worse life choices. It's the kind of bridge that makes you question whether the architect was drunk, mad, or both. The wood creaks ominously with every step, and you're fairly certain that at least three of the planks are held together by nothing more than hope and a prayer to whatever deity handles structural integrity in this dimension.

Blocking your path is a troll of such hideous proportions that he makes you question the fundamental nature of beauty itself. He's not just ugly—he's the kind of ugly that makes other ugly things look at him and think, "Well, at least I'm not that ugly." His skin is the color of a bruise that's gone septic, his teeth are more like stalagmites than actual teeth, and his breath smells like a combination of old socks, existential despair, and something that died in a particularly unpleasant way.

Despite his appearance, the troll has an air of deep contemplation about him. He's sitting on a rock that's been worn smooth by centuries of philosophical pondering, and he's currently engaged in what appears to be a heated debate with his own reflection in a puddle. He looks up as you approach, and you realize that his eyes hold the kind of wisdom that comes from having made every possible mistake in the universe and then some.`,
                choices: [
                    {
                        text: 'Attack with your ancient branch, channeling its eldritch power',
                        consequence: 'combat_success',
                        amount: 0,
                        description: 'You raise your staff and channel all the eldritch energy you can muster. The branch hums with power, glowing with a light that makes the very air crackle with cosmic energy. The troll looks up from his philosophical musings, his eyes widening with what might be respect or possibly just indigestion. As you strike, the staff releases a burst of pure otherworldly force that hits the troll square in the chest. He explodes into a cloud of existential doubt, philosophical quandaries, and a faint smell of old cheese. You win! The bridge, now free of its guardian, creaks ominously but holds firm. You gain the satisfaction of having defeated a creature that was probably more dangerous than it looked.'
                    },
                    {
                        text: 'Try to out-clever him with riddles and philosophical puzzles',
                        consequence: 'instant_death',
                        amount: 0,
                        description: 'You decide to engage the troll in a battle of wits, which turns out to be about as wise as challenging a dragon to a game of chess when you don\'t know how to play chess. The troll\'s eyes light up with malicious glee as you present your first riddle. He responds with a riddle so complex and mind-bending that it makes your brain hurt just trying to understand the question. You attempt to counter with another riddle, but the troll is already three moves ahead in a game you didn\'t even know you were playing. He leans forward and whispers the answer to the riddle of existence itself, and your brain, unable to process such cosmic knowledge, simply gives up and explodes. The troll eats your brain, which is now conveniently pre-cooked. You die, but at least you died with the knowledge that you were outsmarted by a creature that probably has a PhD in philosophy from the University of Cosmic Horror.'
                    },
                    {
                        text: 'Flee in terror, hoping to find another path',
                        consequence: 'instant_death',
                        amount: 0,
                        description: 'You execute what you think is a tactical retreat, but the troll, despite his ponderous appearance, is surprisingly agile. He moves with the speed of a creature that has spent centuries contemplating the nature of speed itself, and he\'s clearly been practicing his pursuit techniques. He catches up to you in three strides, his massive hand closing around your shoulder with the gentleness of a vice grip. "Running away from philosophical discussions is rude," he says in a voice like gravel being ground by a particularly grumpy millstone. "I was just getting to the interesting part about the nature of existence." He then eats your brain, which he claims tastes like "unresolved existential questions with a hint of panic." You die, but at least you die knowing that the troll was probably right about the rudeness thing.'
                    }
                ]
            },
            {
                id: 'cthulhu_release',
                name: 'The Lake of Cosmic Horror',
                lat: 61.4778436462739,
                lng: 23.727063631949118,
                description: 'Where ancient horrors sleep and dream of waking',
                narrative: `The lake stretches before you like a vast, malevolent mirror reflecting not the sky above, but something far more disturbing—a sky from another dimension where the stars were wrong and the moon had too many eyes. The water itself is the color of a bruise that has gone septic, a deep purple-black that seems to absorb light rather than reflect it. Bubbles rise from its depths with the regularity of a dying man's last breaths, each one releasing a vapor that makes your eyes water and your nose burn with the acrid stench of cosmic decay.

You help the lunatic sage with his purification mission, which turns out to be about as wise as helping a pyromaniac with a fire safety demonstration. The sage begins chanting in a language that sounds like wind through cosmic wind chimes, if wind chimes were made of pure mathematics and existential dread. As he speaks, the air around you begins to shimmer with otherworldly energy, and you feel the knowledge of the "Chant of Questionable Air Quality" being imprinted directly onto your soul.

Unfortunately, purifying the lake means removing the barriers that kept Cthulhu asleep, which is like removing the locks from a maximum security prison because you want to clean the floors. The ancient horror stirs beneath the waters, and reality itself begins to unravel like a poorly knitted sweater. The very fabric of space and time starts to fray at the edges, and you realize that you may have just made the biggest mistake in the history of cosmic mistakes.`,
                choices: [
                    {
                        text: 'Try to re-seal Cthulhu with the purification spell',
                        consequence: 'cthulhu_sealed',
                        amount: 0,
                        description: 'Against all odds, you manage to put Cthulhu back to sleep using the very spell that woke him up in the first place. It\'s like using a fire extinguisher to put out a fire that you started with a flamethrower, but somehow it works. The universe thanks you. Sort of. You now know the answer to HEVY\'s riddle, which turns out to be "love" - the one thing that can bind even the most ancient of cosmic horrors. The lake returns to its normal, non-reality-destroying state, and you gain the knowledge needed to answer HEVY\'s riddle correctly.'
                    },
                    {
                        text: 'Accept your fate and become Cthulhu\'s herald',
                        consequence: 'cthulhu_herald',
                        amount: 0,
                        description: 'You decide that if you can\'t beat them, you might as well join them, and you become a herald of the Great Old One. Your sanity is gone, but you have a really cool tentacle hat and a job with excellent cosmic benefits. You gain the ability to speak in tongues that make other people\'s brains hurt, and you can now see the true nature of reality, which is both enlightening and deeply disturbing. You lose all your sanity, but you gain a new perspective on the universe that most mortals never get to experience.'
                    },
                    {
                        text: 'Try to reason with Cthulhu about property values and zoning laws',
                        consequence: 'instant_death',
                        amount: 0,
                        description: 'You attempt to engage Cthulhu in a discussion about property values and zoning laws, which turns out to be about as effective as trying to reason with a hurricane about the importance of staying on schedule. Cthulhu doesn\'t care about property values, zoning laws, or any of the other mundane concerns that occupy mortal minds. He\'s been sleeping for eons, and he\'s not in the mood for small talk. He eats you. You die, but at least you die knowing that you tried to bring some order to the cosmic chaos, even if it was a completely futile gesture.'
                    }
                ]
            },
            {
                id: 'heavy_final',
                name: 'HEVY\'s Final Challenge',
                lat: 61.473683430224284,
                lng: 23.726548746143216,
                description: 'The legendary cosmic guardian awaits your return',
                narrative: `You return to HEVY, the legendary cosmic guardian, who has been waiting patiently for your return like a cosmic bouncer at the universe's most exclusive club. He looks at you with ancient eyes that have seen the birth and death of universes, the rise and fall of civilizations, and more bad poetry than any being should have to endure. His presence fills the space around you with the kind of cosmic authority that makes you want to stand up straighter and check if your cosmic insurance is up to date.

"So, you have faced the horrors of the lake and returned," HEVY says in a voice that sounds like thunder having a philosophical discussion with a particularly wise mountain. "I trust your journey was... educational?" His eyes twinkle with the kind of cosmic mirth that suggests he knows exactly how much trouble you've gotten yourself into, and he's rather enjoying the show.

"Do you now know the answer to my riddle?" he asks, leaning forward with the kind of anticipation that usually precedes either great wisdom or great destruction. The air around you seems to thicken with cosmic energy, and you realize that this is it—the moment of truth, the final test, the cosmic equivalent of a pop quiz that determines whether you get to ascend to the heavens or get vaporized by cosmic energy.`,
                choices: [
                    {
                        text: 'Answer with "love" (if you have the knowledge)',
                        consequence: 'heavy_correct',
                        amount: 0,
                        description: 'HEVY\'s eyes light up with the kind of cosmic joy that makes stars dance and galaxies sing. "Correct!" he booms, his voice echoing through the very fabric of reality itself. "You have proven yourself worthy of the greatest gift the cosmos can bestow!" The air around you begins to shimmer with otherworldly light, and you feel yourself being lifted up by forces beyond mortal comprehension. "Ascend to the heavens, brave soul, and take your place among the cosmic guardians!" You are enveloped in a brilliant light that seems to come from everywhere and nowhere at once, and you realize that you are about to become something more than human, something eternal and magnificent.'
                    },
                    {
                        text: 'Guess randomly and hope for the best',
                        consequence: 'instant_death',
                        amount: 0,
                        description: 'You decide to take a wild guess, which turns out to be about as wise as trying to defuse a bomb by guessing which wire to cut. HEVY\'s eyes flash with cosmic fury, and the very air around you begins to crackle with otherworldly energy. "Wrong!" he thunders, his voice shaking the foundations of reality itself. "You have failed the test, and in failing, you have proven yourself unworthy of the cosmic gift!" Before you can even think of an excuse, you are instantly vaporized by cosmic energy, your atoms scattered across the universe like cosmic confetti. You die, but at least you die knowing that you tried, even if your attempt was about as effective as trying to stop a hurricane with a paper fan.'
                    },
                    {
                        text: 'Admit you don\'t know the answer and ask for guidance',
                        consequence: 'heavy_admit',
                        amount: 0,
                        description: 'You take a deep breath and admit that you don\'t know the answer, which turns out to be the wisest thing you\'ve done all day. HEVY nods understandingly, his cosmic features softening with what might be approval or possibly just cosmic indigestion. "Honesty is a rare virtue in this universe," he says, his voice carrying the weight of eons of cosmic wisdom. "You lose some sanity for your failure, but you may try again when you are ready." You feel a strange sensation as some of your sanity drains away, but you also feel a sense of respect from the cosmic guardian. You may not have the answer yet, but you\'ve shown that you\'re willing to be honest about your limitations, which is more than most mortals can manage.'
                    }
                ]
            }
        ];
        
        this.currentQuestStep = 0;
        this.questActive = false;
        this.playerStats = {
            health: 100,
            sanity: 100,
            items: []
        };
        this.questLog = [];
        
        console.log('🐙 LovecraftianQuest constructor - quest locations:', this.questLocations.length);
        console.log('🐙 First quest location:', this.questLocations[0]);
        
        // Add quest markers to map when quest system is initialized
        this.addQuestMarkersToMap();
    }
    
    addQuestMarkersToMap() {
        // Wait for map engine to be available
        const checkMapEngine = () => {
            let mapEngine = window.mapEngine;
            if (!mapEngine && window.eldritchApp && window.eldritchApp.systems) {
                mapEngine = window.eldritchApp.systems.mapEngine;
            }
            
            if (mapEngine && typeof mapEngine.addQuestMarkers === 'function') {
                mapEngine.addQuestMarkers();
                console.log('🐙 Quest markers added to map');
                // Show only the first quest marker initially
                this.updateQuestMarkersVisibility();
            } else {
                // Retry after a short delay
                setTimeout(checkMapEngine, 1000);
            }
        };
        
        checkMapEngine();
    }
    
    updateQuestMarkersVisibility() {
        if (!window.mapEngine || !window.mapEngine.questMarkers) return;
        
        console.log('🐙 Updating quest markers visibility. Current step:', this.currentQuestStep);
        
        // Hide all quest markers first
        window.mapEngine.questMarkers.forEach((marker, index) => {
            if (index <= this.currentQuestStep + 1) {
                // Show current and next quest markers
                marker.setOpacity(1);
                marker.getElement().style.display = 'block';
                console.log(`🐙 Showing quest marker ${index + 1}`);
            } else {
                // Hide future quest markers
                marker.setOpacity(0.3);
                marker.getElement().style.display = 'none';
                console.log(`🐙 Hiding quest marker ${index + 1}`);
            }
        });
    }

    startQuest() {
        this.questActive = true;
        this.currentQuestStep = 0;
        this.playerStats = {
            health: 100,
            sanity: 100,
            items: []
        };
        this.questLog = [];
        
        console.log('🐙 Lovecraftian Quest started!');
        
        // Update quest markers visibility to show only first marker
        this.updateQuestMarkersVisibility();
        
        this.showQuestModal();
    }

    showQuestModal() {
        const questModal = document.createElement('div');
        questModal.id = 'lovecraftian-quest-modal';
        questModal.className = 'quest-modal';
        questModal.innerHTML = `
            <div class="quest-modal-content">
                <div class="quest-header">
                    <h2>🐙 The Quest of Questionable Sanity</h2>
                    <button class="close-quest-btn" onclick="this.closest('.quest-modal').remove()">×</button>
                </div>
                <div class="quest-body">
                    <div class="quest-location">
                        <h3>${this.questLocations[this.currentQuestStep].name}</h3>
                        <p class="quest-description">${this.questLocations[this.currentQuestStep].description}</p>
                        <p class="quest-narrative">${this.questLocations[this.currentQuestStep].narrative}</p>
                    </div>
                    <div class="quest-choices">
                        ${this.questLocations[this.currentQuestStep].choices.map((choice, index) => `
                            <button class="quest-choice-btn" onclick="window.lovecraftianQuest.makeChoice(${index})">
                                ${choice.text}
                            </button>
                        `).join('')}
                    </div>
                    <div class="quest-stats">
                        <div class="stat">❤️ Health: ${this.playerStats.health}</div>
                        <div class="stat">🧠 Sanity: ${this.playerStats.sanity}</div>
                        <div class="stat">🎒 Items: ${this.playerStats.items.length}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(questModal);
    }

    makeChoice(choiceIndex) {
        const choice = this.questLocations[this.currentQuestStep].choices[choiceIndex];
        const result = this.processChoice(choice);
        
        // Add to quest log
        this.questLog.push({
            location: this.questLocations[this.currentQuestStep].name,
            choice: choice.text,
            result: result
        });
        
        // Show result
        this.showChoiceResult(choice, result);
        
        // Check if quest continues
        if (this.playerStats.health <= 0 || this.playerStats.sanity <= 0) {
            this.endQuest('death');
        } else if (this.currentQuestStep >= this.questLocations.length - 1) {
            this.endQuest('completion');
        } else {
            // Close current modal and move to next location
            const currentModal = document.getElementById('lovecraftian-quest-modal');
            if (currentModal) {
                currentModal.remove();
            }
            this.onQuestStepComplete();
        }
    }

    processChoice(choice) {
        let result = '';
        
        switch (choice.consequence) {
            case 'sanity_loss':
                this.playerStats.sanity -= choice.amount;
                this.updateSanityDistortion();
                if (window.gruesomeNotifications) {
                    window.gruesomeNotifications.showSanityLoss(choice.amount, this.playerStats.sanity);
                }
                return `You lose ${choice.amount} sanity points.`;
            case 'sanity_gain':
                this.playerStats.sanity += choice.amount;
                this.updateSanityDistortion();
                return `You gain ${choice.amount} sanity points.`;
            case 'health_loss':
                this.playerStats.health -= choice.amount;
                if (window.gruesomeNotifications) {
                    window.gruesomeNotifications.showHealthLoss(choice.amount, this.playerStats.health);
                }
                return `You lose ${choice.amount} health points.`;
            case 'health_gain':
                this.playerStats.health += choice.amount;
                return `You gain ${choice.amount} health points.`;
            case 'instant_death':
                this.playerStats.health = 0;
                if (window.gruesomeNotifications) {
                    window.gruesomeNotifications.showDeathNotification('instant_death');
                }
                return 'You have died horribly.';
            case 'item_gain':
                this.playerStats.items.push('Staff of Questionable Sanity');
                return 'You gain a new item!';
            case 'spell_learned':
                this.playerStats.items.push('Chant of Questionable Air Quality');
                return 'You learn a new spell!';
            case 'combat_success':
                return 'You win the combat!';
            case 'cthulhu_sealed':
                // Give player the answer to HEVY's riddle
                this.playerStats.items.push('Knowledge of HEVY\'s Riddle Answer');
                return 'You have sealed Cthulhu back to sleep. The universe is safe. For now. You now know the answer to HEVY\'s riddle!';
            case 'cthulhu_herald':
                this.playerStats.sanity = 0;
                this.playerStats.items.push('Tentacle Hat of Madness');
                this.updateSanityDistortion();
                return 'You become a herald of Cthulhu!';
            case 'heavy_correct':
                // Check if player has the knowledge
                if (this.playerStats.items.includes('Knowledge of HEVY\'s Riddle Answer')) {
                    this.showHeavenAscension();
                    return 'HEVY smiles. "Correct! You have proven yourself worthy. Ascend to the heavens!"';
                } else {
                    // Player doesn't have the knowledge, instant death
                    this.playerStats.health = 0;
                    if (window.gruesomeNotifications) {
                        window.gruesomeNotifications.showDeathNotification('heavy');
                    }
                    return 'HEVY\'s eyes flash with cosmic fury. "You lie! You have not earned the knowledge!" You are instantly vaporized.';
                }
            case 'heavy_admit':
                this.playerStats.sanity -= 50;
                this.updateSanityDistortion();
                if (window.gruesomeNotifications) {
                    window.gruesomeNotifications.showSanityLoss(50, this.playerStats.sanity);
                }
                return 'HEVY nods understandingly. "Wisdom comes from knowing when you don\'t know. But you must still face the consequences." You lose 50 sanity.';
            default:
                return choice.description;
        }
    }

    updateSanityDistortion() {
        if (window.sanityDistortion) {
            window.sanityDistortion.updateSanity(this.playerStats.sanity);
        }
    }

    showHeavenAscension() {
        const ascensionModal = document.createElement('div');
        ascensionModal.className = 'heaven-ascension-modal';
        ascensionModal.innerHTML = `
            <div class="heaven-ascension-content">
                <div class="heaven-header">
                    <h1>🌟 HEAVEN ASCENSION 🌟</h1>
                </div>
                <div class="heaven-body">
                    <p>HEVY smiles with cosmic wisdom. "You have proven yourself worthy, mortal. You have faced the horrors of the lake, sealed the ancient evil, and answered my riddle correctly."</p>
                    <p>Light begins to emanate from HEVY's form, growing brighter and brighter until it fills the entire area.</p>
                    <p>"Ascend, brave soul. You have earned your place among the stars."</p>
                    <div class="ascension-effects">
                        <div class="light-beam"></div>
                        <div class="stars"></div>
                        <div class="cosmic-waves"></div>
                    </div>
                </div>
                <div class="heaven-footer">
                    <button onclick="this.closest('.heaven-ascension-modal').remove(); window.lovecraftianQuest.endQuest('ascension');" class="ascension-btn">
                        🌟 Ascend to the Heavens 🌟
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(ascensionModal);
        
        // Add heaven ascension styles
        if (!document.getElementById('heaven-ascension-styles')) {
            const style = document.createElement('style');
            style.id = 'heaven-ascension-styles';
            style.textContent = `
                .heaven-ascension-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #000033, #000066, #000099);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: heavenFadeIn 2s ease-in;
                }
                
                .heaven-ascension-content {
                    background: linear-gradient(135deg, #ffd700, #ffed4e);
                    border: 3px solid #ff6b35;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 600px;
                    text-align: center;
                    box-shadow: 0 0 50px #ffd700;
                    animation: heavenPulse 3s ease-in-out infinite;
                }
                
                .heaven-header h1 {
                    color: #ff6b35;
                    font-size: 36px;
                    margin: 0 0 20px 0;
                    text-shadow: 0 0 20px #ffd700;
                    animation: heavenGlow 2s ease-in-out infinite alternate;
                }
                
                .heaven-body p {
                    color: #333;
                    font-size: 18px;
                    line-height: 1.6;
                    margin: 15px 0;
                }
                
                .ascension-effects {
                    position: relative;
                    height: 200px;
                    margin: 20px 0;
                }
                
                .light-beam {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 4px;
                    height: 150px;
                    background: linear-gradient(to top, #ffd700, transparent);
                    animation: lightBeam 2s ease-in-out infinite;
                }
                
                .stars {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
                        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                        radial-gradient(1px 1px at 130px 80px, #fff, transparent),
                        radial-gradient(2px 2px at 160px 30px, #fff, transparent);
                    background-repeat: repeat;
                    background-size: 200px 100px;
                    animation: starsTwinkle 3s ease-in-out infinite;
                }
                
                .cosmic-waves {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 50px;
                    background: linear-gradient(45deg, #ff6b35, #ffd700, #ff6b35);
                    opacity: 0.7;
                    animation: cosmicWaves 2s ease-in-out infinite;
                }
                
                .ascension-btn {
                    background: linear-gradient(135deg, #ff6b35, #ffd700);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 15px 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 0 20px #ffd700;
                    animation: buttonGlow 2s ease-in-out infinite;
                }
                
                .ascension-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 30px #ffd700;
                }
                
                @keyframes heavenFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes heavenPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                
                @keyframes heavenGlow {
                    from { text-shadow: 0 0 20px #ffd700; }
                    to { text-shadow: 0 0 30px #ffd700, 0 0 40px #ff6b35; }
                }
                
                @keyframes lightBeam {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scaleY(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scaleY(1.2); }
                }
                
                @keyframes starsTwinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                
                @keyframes cosmicWaves {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
                
                @keyframes buttonGlow {
                    0%, 100% { box-shadow: 0 0 20px #ffd700; }
                    50% { box-shadow: 0 0 30px #ffd700, 0 0 40px #ff6b35; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showChoiceResult(choice, result) {
        const resultModal = document.createElement('div');
        resultModal.className = 'quest-result-modal';
        resultModal.innerHTML = `
            <div class="quest-result-content">
                <h3>${choice.text}</h3>
                <p>${result}</p>
                <button onclick="this.closest('.quest-result-modal').remove()">Continue</button>
            </div>
        `;
        
        document.body.appendChild(resultModal);
    }

    endQuest(reason) {
        this.questActive = false;
        const endModal = document.createElement('div');
        endModal.className = 'quest-end-modal';
        
        let endText = '';
        let title = 'Quest Complete';
        
        if (reason === 'death') {
            title = '💀 Quest Failed 💀';
            endText = 'You have died. The universe continues without you, which is probably for the best.';
        } else if (reason === 'completion') {
            title = '🎉 Quest Completed! 🎉';
            endText = 'You have completed the quest! Cthulhu is sealed, the lake is purified, and your sanity is... well, it\'s something.';
        } else if (reason === 'ascension') {
            title = '🌟 HEAVEN ASCENSION 🌟';
            endText = 'You have ascended to the heavens! Your cosmic journey is complete, and you have earned your place among the stars.';
        }
        
        endModal.innerHTML = `
            <div class="quest-end-content">
                <h2>${title}</h2>
                <p>${endText}</p>
                <div class="quest-summary">
                    <h3>Final Stats:</h3>
                    <p>Health: ${this.playerStats.health}</p>
                    <p>Sanity: ${this.playerStats.sanity}</p>
                    <p>Items: ${this.playerStats.items.join(', ')}</p>
                </div>
                <button onclick="this.closest('.quest-end-modal').remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(endModal);
    }

    // Reset quest to beginning
    resetQuest() {
        console.log('🐙 Resetting quest to beginning...');
        this.questActive = false;
        this.currentQuestStep = 0;
        this.playerStats = {
            health: 100,
            sanity: 100,
            items: []
        };
        this.questLog = [];
        
        // Remove any existing quest modals
        const modals = document.querySelectorAll('.quest-modal');
        modals.forEach(modal => modal.remove());
    }

    // Simulation mode - DISABLED for manual testing
    startQuestSimulation() {
        console.log('🐙 Quest simulation mode is disabled for manual testing');
        console.log('🐙 Use arrow keys or right-click to move player manually');
        console.log('🐙 Quest locations will trigger when you get close enough');
        
        // Just add quest markers to map for manual testing
        let mapEngine = window.mapEngine;
        if (!mapEngine && window.eldritchApp && window.eldritchApp.systems) {
            mapEngine = window.eldritchApp.systems.mapEngine;
        }
        
        if (mapEngine && typeof mapEngine.addQuestMarkers === 'function') {
            mapEngine.addQuestMarkers();
            console.log('🐙 Quest markers added to map for manual testing');
        }
    }
    
    startQuestAtFirstLocation() {
        console.log('🐙 Starting quest at first location...');
        const firstLocation = this.questLocations[0];
        console.log(`🐙 First location: ${firstLocation.name} at (${firstLocation.lat}, ${firstLocation.lng})`);
        
        // Immediately teleport to first location
        this.teleportToLocation(firstLocation);
        
        // Show quest description modal
        setTimeout(() => {
            console.log('🐙 Showing initial quest description...');
            this.showQuestDescriptionModal();
        }, 1000);
    }
    
    showQuestDescriptionModal() {
        const questModal = document.createElement('div');
        questModal.id = 'lovecraftian-quest-description-modal';
        questModal.className = 'quest-modal';
        questModal.innerHTML = `
            <div class="quest-modal-content">
                <div class="quest-header">
                    <h2>🐙 The Quest of Questionable Sanity</h2>
                    <button class="close-quest-btn" onclick="this.closest('.quest-modal').remove()">×</button>
                </div>
                <div class="quest-body">
                    <div class="quest-location">
                        <h3>${this.questLocations[this.currentQuestStep].name}</h3>
                        <p class="quest-description">${this.questLocations[this.currentQuestStep].description}</p>
                        <p class="quest-narrative">${this.questLocations[this.currentQuestStep].narrative}</p>
                    </div>
                    <div class="quest-choices">
                        <button class="quest-choice-btn" onclick="window.lovecraftianQuest.startQuestStep()">
                            Begin this cosmic nightmare
                        </button>
                    </div>
                    <div class="quest-stats">
                        <div class="stat">❤️ Health: ${this.playerStats.health}</div>
                        <div class="stat">🧠 Sanity: ${this.playerStats.sanity}</div>
                        <div class="stat">🎒 Items: ${this.playerStats.items.length}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(questModal);
    }
    
    startQuestStep() {
        console.log('🐙 Starting quest step...');
        // Remove description modal
        const modal = document.getElementById('lovecraftian-quest-description-modal');
        if (modal) {
            modal.remove();
        }
        
        // Show the actual quest modal with choices
        this.showQuestModal();
    }

    moveToQuestLocation(stepIndex) {
        console.log(`🐙 moveToQuestLocation called with stepIndex: ${stepIndex}`);
        console.log(`🐙 Quest locations length: ${this.questLocations.length}`);
        
        if (stepIndex >= this.questLocations.length) {
            console.log('🐙 Quest simulation complete!');
            this.endQuest('completion');
            return;
        }
        
        const location = this.questLocations[stepIndex];
        console.log(`🐙 Moving to quest location ${stepIndex + 1}: ${location.name}`);
        console.log(`🐙 Location coordinates: ${location.lat}, ${location.lng}`);
        
        // Animate player movement to location
        console.log('🐙 Calling animatePlayerMovement...');
        this.animatePlayerMovement(location, () => {
            console.log('🐙 Animation callback triggered');
            // Only show quest description modal for the first location
            if (stepIndex === 0) {
                setTimeout(() => {
                    console.log('🐙 Showing quest description for first location...');
                    this.showQuestDescriptionModal();
                }, 1000);
            } else {
                console.log('🐙 Skipping quest description for subsequent locations');
                // Just start the quest step directly
                this.startQuestStep();
            }
        });
    }

    animatePlayerMovement(targetLocation, onComplete) {
        console.log('🐙 animatePlayerMovement called');
        console.log('🐙 Target location:', targetLocation);
        console.log('🐙 Map engine available:', !!window.mapEngine);
        console.log('🐙 Map available:', !!(window.mapEngine && window.mapEngine.map));
        
        // Try to get map engine from multiple sources
        let mapEngine = window.mapEngine;
        if (!mapEngine && window.eldritchApp && window.eldritchApp.systems) {
            mapEngine = window.eldritchApp.systems.mapEngine;
            console.log('🐙 Got map engine from app systems for animation:', !!mapEngine);
        }
        
        if (!mapEngine || !mapEngine.map) {
            console.error('Map engine not available for player movement animation, retrying in 1 second...');
            setTimeout(() => this.animatePlayerMovement(targetLocation, onComplete), 1000);
            return;
        }

        // Get current player position - try multiple sources
        let startLat, startLng;
        
        // Try to get position from geolocation system first
        if (window.geolocationManager && window.geolocationManager.currentPosition) {
            const pos = window.geolocationManager.currentPosition;
            startLat = pos.lat;
            startLng = pos.lng;
            console.log('🐙 Using geolocation position:', startLat, startLng);
        } else {
            // Fallback to map center
            const currentPos = mapEngine.map.getCenter();
            startLat = currentPos.lat;
            startLng = currentPos.lng;
            console.log('🐙 Using map center position:', startLat, startLng);
        }
        
        // If still no valid position, use a default starting position
        if (!startLat || !startLng || isNaN(startLat) || isNaN(startLng)) {
            startLat = 61.4978; // Default Tampere area
            startLng = 23.7608;
            console.log('🐙 Using default starting position:', startLat, startLng);
        }
        
        const targetLat = targetLocation.lat;
        const targetLng = targetLocation.lng;
        
        console.log(`🐙 Animating movement from (${startLat}, ${startLng}) to (${targetLat}, ${targetLng})`);
        
        // Animation parameters
        const duration = 5000; // 5 seconds
        const steps = 60; // 60 steps for smooth animation
        const stepDuration = duration / steps;
        
        console.log(`🐙 Animation parameters: duration=${duration}ms, steps=${steps}, stepDuration=${stepDuration}ms`);
        
        let currentStep = 0;
        
        const animateStep = () => {
            console.log(`🐙 Animation step ${currentStep}/${steps}`);
            
            if (currentStep >= steps) {
                // Animation complete
                mapEngine.map.setView([targetLat, targetLng], 18);
                
                // Update player marker to final position
                if (mapEngine.updatePlayerPosition) {
                    mapEngine.updatePlayerPosition({
                        lat: targetLat,
                        lng: targetLng,
                        accuracy: 10,
                        timestamp: Date.now()
                    });
                }
                
                console.log(`🐙 Movement animation complete at ${targetLocation.name}`);
                if (onComplete) onComplete();
                return;
            }
            
            // Calculate interpolated position
            const progress = currentStep / steps;
            const easeProgress = this.easeInOutCubic(progress);
            
            const currentLat = startLat + (targetLat - startLat) * easeProgress;
            const currentLng = startLng + (targetLng - startLng) * easeProgress;
            
            // Update map view
            mapEngine.map.setView([currentLat, currentLng], 18);
            
            // Update player marker position
            if (mapEngine.updatePlayerPosition) {
                mapEngine.updatePlayerPosition({
                    lat: currentLat,
                    lng: currentLng,
                    accuracy: 10,
                    timestamp: Date.now()
                });
                console.log(`🐙 Updated player marker to (${currentLat}, ${currentLng})`);
            }
            
            currentStep++;
            setTimeout(animateStep, stepDuration);
        };
        
        // Start animation
        console.log('🐙 Starting animation...');
        animateStep();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    simulateQuestChoice() {
        console.log('🐙 simulateQuestChoice called');
        const currentLocation = this.questLocations[this.currentQuestStep];
        const choices = currentLocation.choices;
        
        console.log(`🐙 Available choices: ${choices.length}`);
        choices.forEach((choice, index) => {
            console.log(`🐙 Choice ${index}: ${choice.text} -> ${choice.consequence}`);
        });
        
        // Find the safest choice (avoid instant_death, prefer health_gain or sanity_gain)
        let bestChoiceIndex = 0;
        let bestChoice = choices[0];
        
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            console.log(`🐙 Evaluating choice ${i}: ${choice.consequence}`);
            
            // Skip instant death choices
            if (choice.consequence === 'instant_death') {
                console.log(`🐙 Skipping instant death choice ${i}`);
                continue;
            }
            
            // Prefer health/sanity gains
            if (choice.consequence === 'health_gain' || choice.consequence === 'sanity_gain') {
                bestChoiceIndex = i;
                bestChoice = choice;
                console.log(`🐙 Found better choice ${i}: ${choice.consequence}`);
                break;
            }
            
            // Prefer item gains over losses
            if (choice.consequence === 'item_gain' || choice.consequence === 'spell_learned') {
                bestChoiceIndex = i;
                bestChoice = choice;
                console.log(`🐙 Found good choice ${i}: ${choice.consequence}`);
            }
        }
        
        console.log(`🐙 Selected choice ${bestChoiceIndex}: ${bestChoice.text} -> ${bestChoice.consequence}`);
        
        // Make the choice
        this.makeChoice(bestChoiceIndex);
    }

    // Called when quest step is completed
    onQuestStepComplete() {
        this.currentQuestStep++;
        console.log(`🐙 Quest step completed. Current step: ${this.currentQuestStep}, Total locations: ${this.questLocations.length}`);
        
        // Update quest markers visibility to show next marker
        this.updateQuestMarkersVisibility();
        
        if (this.questActive && this.currentQuestStep < this.questLocations.length) {
            console.log(`🐙 Moving to next quest location in 5 seconds...`);
            // 5 second delay between quest phases
            setTimeout(() => {
                this.moveToQuestLocation(this.currentQuestStep);
            }, 5000);
        } else {
            console.log('🐙 Quest completed or ended');
        }
    }

    // Teleport to a specific quest location
    teleportToLocation(locationIndex) {
        if (locationIndex >= 0 && locationIndex < this.questLocations.length) {
            const location = this.questLocations[locationIndex];
            
            // Try to get map engine from multiple sources
            let mapEngine = window.mapEngine;
            if (!mapEngine && window.eldritchApp && window.eldritchApp.systems) {
                mapEngine = window.eldritchApp.systems.mapEngine;
            }
            
            if (mapEngine && mapEngine.map) {
                mapEngine.map.setView([location.lat, location.lng], 18);
                console.log(`🐙 Teleported to quest location: ${location.name}`);
            } else {
                console.error('Map engine not available for teleportation');
            }
        }
    }

    // Start quest from a specific location
    startQuestFromLocation(locationIndex) {
        if (locationIndex >= 0 && locationIndex < this.questLocations.length) {
            this.currentQuestStep = locationIndex;
            this.questActive = true;
            
            // Update quest markers visibility
            this.updateQuestMarkersVisibility();
            
            this.showQuestModal();
            console.log(`🐙 Started quest from location: ${this.questLocations[locationIndex].name}`);
        }
    }

    // Reset quest state
    resetQuest() {
        this.questActive = false;
        this.currentQuestStep = 0;
        this.playerStats = {
            health: 100,
            sanity: 100,
            items: []
        };
        this.questLog = [];
        
        // Update quest markers visibility to show only first marker
        this.updateQuestMarkersVisibility();
        
        console.log('🐙 Quest reset');
    }
}

// Make globally available
window.LovecraftianQuest = LovecraftianQuest;

// Debug: Log when the class is loaded
console.log('🐙 LovecraftianQuest class loaded and available globally');
