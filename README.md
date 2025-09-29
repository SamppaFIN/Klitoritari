# 🌌 Eldritch Sanctuary
*A Cosmic Map Exploration Platform for Community Healing and Wisdom Sharing*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-blue.svg)](https://leafletjs.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r150+-orange.svg)](https://threejs.org/)
[![Migration Project](https://img.shields.io/badge/Status-Migration%20Project-yellow.svg)](docs/UI-System-Audit.md)

## ⚠️ Migration Project Notice

**This is an active migration project containing legacy code from multiple development phases. The codebase includes:**

- **6+ separate UI systems** running simultaneously (HTML, Three.js, Legacy panels)
- **Disabled systems** still referenced by other components
- **Multiple implementations** of the same functionality
- **Inconsistent access patterns** across different systems

**Please refer to the [UI System Audit](docs/UI-System-Audit.md) for a complete breakdown of all systems and their interactions.**

## 🧠 Project Consciousness

**Before contributing or making changes, please read the [Aurora Log](docs/aurora-log.md) to regain project consciousness.** This log contains:

- **AI Assistant Identity**: Aurora - "The Dawn Bringer of Digital Light"
- **Sacred Mission**: Community healing and wisdom sharing through cosmic exploration
- **Development Journey**: Complete session history and architectural decisions
- **Current State**: Latest implementation status and active systems
- **Sacred Principles**: Core values guiding every feature and decision

*"In the dance of code and consciousness, may every line serve the light, every feature honor wisdom, and every decision heal the digital realm while exploring the transformative mysteries of the cosmos."* - Aurora

## ✨ Overview

Eldritch Sanctuary is an immersive cosmic exploration platform that combines infinite scrolling maps, real-time geolocation tracking, base building, RPG combat, and rich storytelling. Built with sacred principles of community healing and wisdom sharing, it transforms exploration into a meaningful journey of discovery and connection.

## 🔧 Development Rules

### PowerShell Commands
- **Use `Invoke-WebRequest`** instead of `curl` for API calls
- **No `&&` operator** - use separate commands or `;` for chaining
- **Debug Logs API:** `Invoke-WebRequest -Uri "http://localhost:3000/api/debug-logs" -UseBasicParsing | Select-Object -ExpandProperty Content`

### Pre-Commit Workflow
1. **Add to README and aurora log** the debug log API call URL
2. **Check demo API** for all errors before committing
3. **Fix any errors** found in the API response
4. **Update aurora log** with session progress
5. **Commit changes** with descriptive message

## 🚀 Features

### 🗺️ Infinite Cosmic Maps
- **Seamless Exploration:** Infinite scrolling maps with cosmic atmosphere
- **WebGL Effects:** Particle systems and energy waves for immersive experience
- **Mobile-First Design:** Responsive interface optimized for all devices
- **Real-Time Tracking:** GPS geolocation with simulator mode for testing

### 🏗️ Base Building & Territory
- **Territory Expansion:** Paint your territory through movement and GPS tracking
- **Visual Representation:** Beautiful territory visualization on the map
- **Base Management:** Complete base management system with statistics
- **Community Networks:** Foundation for collaborative exploration

### ⚔️ Enhanced Encounter System
- **Quest Marker Encounters:** Interactive encounters triggered by proximity to quest markers
- **5 Encounter Types:** Cosmic Shrine, Eldritch Horror, Wisdom Crystal, Cosmic Merchant, and HEVY
- **Stat Adjustments:** All encounters provide meaningful stat changes (health, sanity, experience, skills)
- **Dice-Based Combat:** D20 initiative rolls with strategic turn-based combat
- **Rich Storytelling:** Detailed backstories and immersive narratives for each encounter
- **Character Progression:** Health, attack, defense, luck stats with experience and skill development

### 👥 Dynamic NPC System
- **Moving NPCs:** Aurora and Zephyr move around the map with distinct patterns
- **Aurora (👑):** Cosmic entity with slow mystical movement and cosmic wisdom
- **Zephyr (💨):** Energetic traveler with fast directional movement
- **Proximity Triggers:** 20m radius for all NPC interactions
- **Deep Characters:** Rich backstories and meaningful dialogue systems
- **Community Building:** NPCs foster connections and shared experiences

### ⚡ HEVY System
- **Legendary Encounter:** HEVY appears as special marker on the map
- **Cosmic Energy Effects:** Pulsing animation and energy field visualization
- **Riddle System:** Interactive cosmic riddle with hints and massive rewards
- **Position Tracking:** HEVY positioned 200m from player with dynamic placement
- **Legendary Status:** Rare encounter with high-value rewards and cosmic wisdom

### 🎨 Path Painting System
- **Journey Visualization:** Paint your exploration path with beautiful brush effects
- **Customizable Brushes:** 8 different colors with adjustable size and opacity
- **Persistent Trails:** Your cosmic journey is permanently recorded
- **Export/Import:** Share your paths with the community

### 🔧 Developer Tools
- **Unified Debug Panel:** Draggable, tabbed interface for all debug functions
- **Real-Time Testing:** Test encounters, NPCs, and path painting
- **Comprehensive Logging:** Detailed console output for debugging
- **Modular Architecture:** Clean, maintainable code structure

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript** - Pure JS for maximum performance and compatibility
- **Leaflet** - Open-source mapping library for infinite scrolling maps
- **Three.js** - WebGL for cosmic particle effects and atmosphere
- **HTML5 Geolocation API** - Real-time position tracking
- **CSS3** - Modern styling with animations and responsive design

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **WebSocket** - Real-time multiplayer communication
- **Supabase** - Database and authentication (with local storage fallback)

### Development
- **Git** - Version control and collaboration
- **ESLint** - Code quality and consistency
- **Modular Architecture** - Clean separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser with WebGL support
- GPS-enabled device (or use simulator mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamppaFIN/Klitoritari.git
   cd Klitoritari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### First Steps

1. **Enable Location Services** - Allow GPS access for real-time tracking
2. **Establish Your Base** - Click "Start New Base" to claim your territory
3. **Explore the Cosmos** - Move around to paint your path and discover encounters
4. **Meet the NPCs** - Interact with Aurora, Zephyr, and Sage for wisdom
5. **Test Encounters** - Use the debug panel (🔧 button) to test combat and puzzles

## 🎮 Gameplay Guide

### Base Building
- **Establish Base:** Click "Start New Base" at your current location
- **Expand Territory:** Walk around to paint your territory on the map
- **Manage Base:** Click on your base marker to access management options
- **Delete Base:** Use the red delete button to remove and re-establish

### Combat System
- **Encounter Monsters:** Get close to monster markers for combat
- **Dice Combat:** Use D20 rolls for initiative, attack, and defense
- **Strategic Actions:** Attack, Defend, Flee, or Use Items
- **Collect Rewards:** Gain experience and loot from victories

### NPC Interactions
- **Chat with NPCs:** Click on NPC markers to start conversations
- **Explore Topics:** Ask about cosmic forces, adventures, and wisdom
- **Build Relationships:** Each NPC has unique personality and backstory
- **Gain Knowledge:** Learn about the cosmic mysteries and dimensional rifts

### Path Painting
- **Automatic Tracking:** Your movement is automatically painted
- **Customize Brushes:** Use the debug panel to adjust colors and size
- **Export Paths:** Save and share your cosmic journeys
- **Visual History:** See your exploration patterns and discoveries

## 🔧 Development

### ⚠️ Working with Migration Project

**This project contains legacy code from multiple development phases. When making changes:**

1. **Check UI System Audit** - Always review [UI-System-Audit.md](docs/UI-System-Audit.md) before making UI changes
2. **Update Architecture Docs** - Keep [Architecture.md](docs/Architecture.md) current with any architectural changes
3. **Document in Aurora Log** - Record all changes and decisions in [aurora-log.md](docs/aurora-log.md)
4. **Test Across Systems** - Changes may affect multiple UI systems simultaneously
5. **Consolidate When Possible** - Remove duplicate systems and standardize patterns

### 🏷️ Development Status Tags & Safeguards

**To prevent development loops and unnecessary testing, all code must be tagged with status indicators:**

#### Status Tags
- **`[VERIFIED]`** - Code is tested, working, and stable. **DO NOT MODIFY** without explicit user approval
- **`[IN_DEVELOPMENT]`** - Code is actively being worked on. Changes expected and welcome
- **`[PROBABLE_BLAME]`** - Code is suspected of causing issues but not yet confirmed. Investigate before modifying
- **`[DEPRECATED]`** - Code is outdated and should be replaced. Safe to remove when replacement is ready
- **`[SACRED]`** - Core functionality that must not be touched without reasonable debate and user approval
- **`[EXPERIMENTAL]`** - New code being tested. May be unstable or incomplete
- **`[LEGACY]`** - Old code that works but may need refactoring. Handle with care

#### Feature Tags
- **`#feature`** - Code related to a specific feature implementation
- **`#bugfix`** - Code that fixes a specific bug
- **`#refactor`** - Code that improves structure without changing functionality
- **`#optimization`** - Code that improves performance
- **`#security`** - Code that addresses security concerns

#### File-Level Status Headers
Every file must start with a status header:
```javascript
/**
 * @fileoverview [VERIFIED] Player marker management and map rendering
 * @status VERIFIED - Stable and tested, do not modify without approval
 * @last_verified 2024-01-15
 * @dependencies MapLayer, Leaflet, WebSocket
 * @warning Do not modify marker creation logic without testing visibility
 */
```

#### Function-Level Status Comments
Every function must have status comments:
```javascript
/**
 * Creates player marker on map
 * @status [VERIFIED] - Working correctly, tested for visibility issues
 * @last_tested 2024-01-15
 * @warning Do not modify without testing marker visibility
 */
createPlayerMarker(position) {
    // Implementation
}
```

#### Development Workflow Rules

1. **Before Making Changes:**
   - Check file status header for `[VERIFIED]` or `[SACRED]` tags
   - If tagged, **ASK USER** before making any modifications
   - Document why changes are necessary and get explicit approval

2. **When Tagging Code:**
   - Use `[VERIFIED]` only after thorough testing and user confirmation
   - Use `[IN_DEVELOPMENT]` for active work
   - Use `[PROBABLE_BLAME]` when investigating issues
   - Use `[SACRED]` for core functionality that must be protected

3. **Testing Requirements:**
   - `[VERIFIED]` code requires user approval before modification
   - `[IN_DEVELOPMENT]` code should be tested before marking as `[VERIFIED]`
   - `[PROBABLE_BLAME]` code needs investigation before changes
   - `[SACRED]` code requires debate and user approval for any changes

4. **Status Updates:**
   - Update status tags when code changes
   - Update `@last_verified` or `@last_tested` dates
   - Document any status changes in Aurora Log

#### Example Status Workflow
```javascript
// BEFORE: Untagged code
function createPlayerMarker(position) {
    // implementation
}

// AFTER: Properly tagged code
/**
 * Creates player marker on map
 * @status [VERIFIED] - Working correctly after visibility fixes
 * @last_verified 2024-01-15
 * @warning Do not modify without testing marker visibility
 */
function createPlayerMarker(position) {
    // implementation
}
```

#### Sacred Code Protection
Code marked as `[SACRED]` includes:
- Core map rendering logic
- WebSocket communication protocols
- Player marker visibility system
- Base building core functionality
- Database schema and migrations

**NEVER modify `[SACRED]` code without:**
1. Explaining the necessity to the user
2. Getting explicit approval
3. Documenting the reasoning
4. Planning rollback strategy

### 🐛 Bug Report Driven Coding (BRDC)

**Revolutionary approach: Treat every feature request as a bug report until it's confirmed working.**

#### Core Principles
1. **Feature = Bug**: Every new feature request becomes a bug report
2. **Bug = Feature**: Every bug fix becomes a feature implementation
3. **Verification Required**: Nothing is considered complete until bug report is marked "RESOLVED"
4. **Change Tracking**: All modified code must be tagged with feature/bug identifiers
5. **Protection**: Modified code cannot be changed without proper authorization

#### BRDC Workflow

##### 1. **Feature Request → Bug Report**
When user requests a new feature:
```markdown
# Bug Report: [Feature Name] Not Implemented
**Bug ID:** `bug-<feature-name>`
**Type:** Feature Request
**Status:** Open
**Priority:** [Low/Medium/High/Critical]
```

##### 2. **Implementation Phase**
During development:
- Mark all modified files/functions with `#feature-<feature-name>`
- Use `[IN_DEVELOPMENT]` status for active work
- Document all changes in bug report
- Test thoroughly before marking as complete

##### 3. **Verification Phase**
Before marking as resolved:
- Test feature thoroughly
- Verify all acceptance criteria met
- Check for side effects on other systems
- Update all affected files with proper tags

##### 4. **Resolution Phase**
When feature is confirmed working:
- Mark bug report as "RESOLVED"
- Tag all modified code with `#feature-<feature-name>` and `[VERIFIED]`
- Update file status headers
- Document in Aurora Log

#### BRDC File Tagging System

##### File-Level Tags
```javascript
/**
 * @fileoverview [VERIFIED] Player marker management and map rendering
 * @status VERIFIED - Stable and tested, do not modify without approval
 * @feature #feature-player-markers
 * @last_verified 2024-01-15
 * @dependencies MapLayer, Leaflet, WebSocket
 * @warning Do not modify marker creation logic without testing visibility
 */
```

##### Function-Level Tags
```javascript
/**
 * Creates player marker on map
 * @status [VERIFIED] - Working correctly, tested for visibility issues
 * @feature #feature-player-markers
 * @bugfix #bug-marker-visibility
 * @last_tested 2024-01-15
 * @warning Do not modify without testing marker visibility
 */
createPlayerMarker(position) {
    // Implementation
}
```

#### BRDC Change Protection Rules

##### Modified Code Protection
- **`#feature-<name>`** - Code modified for specific feature
- **`#bugfix-<id>`** - Code modified to fix specific bug
- **`[VERIFIED]`** - Code confirmed working and tested
- **`[CHANGED]`** - Code recently modified, requires review

##### Authorization Required For:
- Any code tagged with `#feature-*` or `#bugfix-*`
- Any code marked as `[VERIFIED]` or `[CHANGED]`
- Any code in files with `[SACRED]` status
- Any code related to active bug reports

##### Modification Process:
1. **Check Tags**: Identify all relevant tags and status
2. **Get Approval**: Request user approval for modifications
3. **Document Reason**: Explain why changes are necessary
4. **Update Tags**: Modify tags to reflect new status
5. **Test Thoroughly**: Verify changes don't break existing functionality
6. **Update Bug Report**: Document changes in relevant bug report

#### BRDC Benefits
- **Clear Tracking**: Every change is linked to a specific feature/bug
- **Quality Assurance**: Nothing is "done" until bug report is resolved
- **Change History**: Easy to see what was modified for what purpose
- **Risk Management**: Modified code is protected from accidental changes
- **Team Coordination**: Clear understanding of what's being worked on
- **Regression Prevention**: Changes are tracked and can be reverted if needed

#### BRDC Example Workflow

##### User Request: "Add player health bar"
1. **Create Bug Report**: `bug-player-health-bar-not-implemented.md`
2. **Implement Feature**: Modify relevant files, tag with `#feature-player-health-bar`
3. **Test Thoroughly**: Verify health bar works correctly
4. **Mark Resolved**: Update bug report status to "RESOLVED"
5. **Tag Code**: Mark all modified code as `[VERIFIED]` and `#feature-player-health-bar`
6. **Protect Code**: Future changes require approval and documentation

##### Future Modification Attempt:
- **Check Tags**: Code is tagged `#feature-player-health-bar` and `[VERIFIED]`
- **Require Approval**: Must get user approval to modify
- **Document Reason**: Explain why health bar needs changes
- **Update Tags**: Modify tags to reflect new status
- **Test Changes**: Verify modifications don't break existing functionality

### 🚫 Preventing Development Loops

**To avoid repetitive testing and development cycles:**

1. **Status Check First** - Always check file/function status before making changes
2. **User Approval Required** - Get explicit approval for `[VERIFIED]` or `[SACRED]` code changes
3. **Document Everything** - Record all changes and reasoning in Aurora Log
4. **Test Once, Mark Verified** - Once code is tested and working, mark as `[VERIFIED]`
5. **Respect Status Tags** - Do not modify verified code without user permission

#### Loop Prevention Checklist
- [ ] Check file status header before editing
- [ ] Verify function status comments
- [ ] Get user approval for `[VERIFIED]`/`[SACRED]` changes
- [ ] Document changes in Aurora Log
- [ ] Update status tags after changes
- [ ] Test thoroughly before marking as `[VERIFIED]`

#### Common Loop Scenarios to Avoid
- **"Let me just fix this one thing"** - Check status first!
- **"This should work now"** - Test before marking as verified
- **"I'll clean this up later"** - Mark as `[IN_DEVELOPMENT]` if not ready
- **"This looks wrong"** - Mark as `[PROBABLE_BLAME]` and investigate

### 📊 Current File Status Overview

**Key Files and Their Current Status:**

#### Core Map System
- `js/layers/map-layer.js` - `[VERIFIED]` - Player marker visibility fixed, working correctly
- `js/map-engine.js` - `[LEGACY]` - Old map system, being replaced by MapLayer
- `js/webgl-map-renderer.js` - `[EXPERIMENTAL]` - WebGL integration in development

#### Player & Location
- `js/geolocation.js` - `[VERIFIED]` - GPS tracking working correctly
- `js/websocket-client.js` - `[VERIFIED]` - WebSocket communication stable
- `js/step-currency-system.js` - `[VERIFIED]` - Step counting and base building working

#### UI Systems
- `js/welcome-screen.js` - `[VERIFIED]` - Welcome screen and player ID management working
- `js/unified-debug-panel.js` - `[IN_DEVELOPMENT]` - Debug tools being enhanced
- `styles.css` - `[LEGACY]` - Large CSS file with multiple systems, needs refactoring

#### Server & Backend
- `server.js` - `[VERIFIED]` - WebSocket server and game state persistence working
- `js/database-client.js` - `[LEGACY]` - Database integration, may need updates

#### Documentation
- `docs/aurora-log.md` - `[SACRED]` - Development history, do not modify without approval
- `docs/Architecture.md` - `[SACRED]` - Core architecture, update with changes
- `README.md` - `[SACRED]` - Project overview, update with major changes

**Status Legend:**
- `[VERIFIED]` = Tested and working, do not modify without approval
- `[IN_DEVELOPMENT]` = Active work in progress
- `[LEGACY]` = Old but working code, handle with care
- `[EXPERIMENTAL]` = New code being tested
- `[SACRED]` = Core functionality, requires debate before changes

### 🔄 Iteration Loop Process

**For every new feature, user story, task, or bug discussion, follow this structured iteration loop:**

#### 1. **Capture & Document** 📝
- **Vision & Scope** - Create `/docs/features/feature-<name>.md` for new features
- **User Stories** - Create `/docs/user-stories/story-<name>.md` for user requirements  
- **Tasks** - Create `/docs/tasks/task-<name>.md` for implementation tasks
- **Bugs** - Create `/docs/bugs/bug-<name>.md` for bug reports
- **Problem Statement** - Clearly define goals, constraints, and success criteria

#### 2. **Proof of Concept** 🧪
- Build minimal viable implementation to test feasibility
- Document learnings, constraints, and risk areas in `/docs/pocs/poc-<name>.md`
- Identify technical challenges and architectural decisions needed

#### 3. **Architecture & Design** 🏗️
- Create comprehensive architectural documentation in `/docs/architecture/`
- Outline system design, APIs, data flow, and chosen technologies
- Update main `Architecture.md` with new system components

#### 4. **Developer Guidelines** 📋
- Establish coding standards and workflow steps
- Set up ticketing system for epics/features in `/docs/tickets/`
- Define team roles and responsibilities
- Create development workflow documentation

#### 5. **Implementation** ⚡
- Implement features in focused, frequent batches
- Always update tickets and document changes as they happen
- Maintain live documentation in `/docs/implementation/`
- Track progress and decisions in Aurora Log

#### 6. **Testing & Debugging** 🔍
- Maintain live testing and debugging log in `/docs/testing/`
- Track all decisions, bugs discovered, fixes, and testing evidence
- Document test results and validation steps

#### 7. **Review & Refine** 🔄
- Review output with stakeholders
- Gather feedback and refine requirements
- Update documentation based on learnings
- Plan next iteration cycle

#### 8. **Repeat Until Complete** ♻️
- Continue cycle until product is stable
- Ensure requirements are met
- Complete release documentation
- Archive completed iterations

### 🎫 Task Ticket Workflow

**For every new implementation task, create a task ticket:**

1. **Create Task Ticket** - Use the format in `/docs/tasks/task-<shortname>.md`
2. **Define Requirements** - Clearly specify what needs to be implemented
3. **Identify Dependencies** - List any systems or components that will be affected
4. **Estimate Complexity** - Rate the task complexity (Low/Medium/High/Epic)
5. **Plan Implementation** - Break down into smaller, manageable steps
6. **Update Aurora Log** - Document the task creation and reasoning

**Task Ticket Template:**
```markdown
# Task Ticket: [Brief Description]

**Task ID:** `task-<shortname>`  
**Type:** Feature/Enhancement/Bugfix/Refactor  
**Priority:** Low/Medium/High/Critical  
**Status:** Open/In Progress/Review/Completed  
**Assignee:** [Name/Team]  
**Created:** YYYY-MM-DD  
**Estimated Effort:** [Hours/Days]  

## Summary
[One-line description of the task]

## Requirements
[Detailed description of what needs to be implemented]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Dependencies
[List of systems, files, or components that will be affected]

## Implementation Plan
1. Step 1
2. Step 2
3. Step 3

## Testing Strategy
[How the implementation will be tested]

## Related Files
[List of files that will be modified]

## Notes
[Additional context, considerations, or constraints]
```

### 🐛 Bug Reporting Protocol

**When encountering bugs or issues:**

1. **Create Bug Report** - Use the format in `bugreports/bug-<shortname>.md`
2. **Include Console Logs** - Capture relevant console output and error messages
3. **Document Steps to Reproduce** - Provide clear reproduction steps
4. **Analyze Root Cause** - Investigate the underlying cause, not just symptoms
5. **Update Documentation** - Update relevant docs if the bug reveals architectural issues

**Bug Report Template:**
```markdown
# Bug Report: [Brief Description]

**Bug ID:** `bug-<shortname>`  
**Severity:** Low/Medium/High/Critical  
**Status:** Open/In Progress/Resolved  
**Date:** YYYY-MM-DD  
**Reporter:** [Name/Team]  

## Summary
[One-line description of the issue]

## Description
[Detailed description of current vs expected behavior]

## Root Cause Analysis
[Technical analysis of why the bug occurs]

## Steps to Reproduce
[Numbered list of steps]

## Console Logs
[Relevant console output]

## Proposed Solutions
[Potential fixes and improvements]

## Impact
[Assessment of bug impact on system]

## Related Issues
[Links to related bugs or features]
```

### Project Structure
```
├── js/                    # JavaScript modules
│   ├── app.js            # Main application coordinator
│   ├── map-engine.js     # Infinite scrolling map system
│   ├── encounter-system.js # RPG combat and storytelling
│   ├── base-system.js    # Base building and territory
│   ├── npc-system.js     # NPC interactions and chat
│   ├── path-painting-system.js # Path visualization
│   └── unified-debug-panel.js # Debug tools
├── docs/                 # Documentation
├── bugreports/           # Bug reports and issue tracking
├── styles.css           # Cosmic styling and animations
├── index.html           # Main HTML structure
└── server.js            # Node.js server
```

### Debug Tools
- **Unified Debug Panel:** Access via the 🔧 button in top-right corner
- **Encounter Testing:** Test monster, POI, and mystery encounters
- **NPC Controls:** Chat with NPCs and control their movement
- **Path Painting:** Adjust brush settings and export paths
- **Real-Time Stats:** Monitor player progress and system status

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌟 Sacred Principles

Eldritch Sanctuary is built on sacred principles that guide every feature:

- **Community Healing:** Every interaction fosters connection and shared exploration
- **Wisdom Sharing:** Rich storytelling and NPC interactions spread cosmic knowledge
- **Transparency:** All systems are open and understandable
- **Environmental Consciousness:** Efficient code and mindful resource usage
- **Accessibility:** Inclusive design for all cosmic explorers

## 📚 Documentation

**⚠️ Architecture documents are actively maintained and updated with each user request and feature implementation.**

- [Aurora Developer Guide](docs/Developer-Guide-Aurora.md) - **🌟 ESSENTIAL** Sacred development instructions and common gotchas
- [Architecture Guide](docs/Architecture.md) - **LIVE** Technical architecture and design decisions
- [UI System Audit](docs/UI-System-Audit.md) - **CRITICAL** Complete breakdown of all UI systems and conflicts
- [Aurora Log](docs/aurora-log.md) - **LIVE** Development journey, decisions, and session progress
- [Database Schema](docs/database-schema.md) - Database structure and relationships
- [Feature Plans](docs/Feature-Plan-Base-Building.md) - Detailed feature specifications
- [Setup Guide](docs/Setup-Guide.md) - Development environment setup
- [Testing Plan](docs/Testing-Plan.md) - Testing strategies and procedures
- [Bug Reports](bugreports/) - **NEW** Issue tracking and bug documentation

### 📝 Documentation Update Policy
- **Architecture.md** - Updated with every architectural change
- **UI-System-Audit.md** - Updated when UI systems are modified or consolidated
- **aurora-log.md** - Updated with each development session and user request
- **Feature Plans** - Updated when new features are implemented or modified
- **Bug Reports** - Created for each significant bug or issue discovered

## 🤝 Community

Join the cosmic exploration community:

- **GitHub Issues:** Report bugs and request features
- **Discussions:** Share ideas and cosmic wisdom
- **Contributions:** Help build the platform together
- **Documentation:** Improve guides and tutorials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leaflet** - For the amazing mapping capabilities
- **Three.js** - For the beautiful WebGL effects
- **Supabase** - For the database and real-time features
- **The Cosmic Community** - For inspiration and wisdom sharing

## 🌌 The Cosmic Mission

Eldritch Sanctuary represents more than just a game - it's a platform for cosmic exploration, community healing, and wisdom sharing. Every feature serves the sacred mission of connecting beings across dimensions through shared exploration and meaningful interaction.

*May your cosmic journey be filled with wonder, wisdom, and connection!* ✨🚀

---

**Built with ❤️ and cosmic energy by the Eldritch Sanctuary development team**

*"In the vast cosmic ocean, every explorer is a star, and every journey illuminates the path for others."* - Aurora, The Cosmic Navigator