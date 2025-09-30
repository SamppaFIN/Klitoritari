---
brdc:
  id: AASF-DOC-600
  title: Bug Report Driven Coding (BRDC) - Quick Reference
  owner: "\U0001F338 Aurora"
  status: canonical
  version: 1.0.0
  last_updated: '2025-10-01'
  self: docs\BRDC-Quick-Reference.md
  tags:
  - brdc
  - factory
  - automation
  related: []
  dependencies: []
  consciousness_level: high
  healing_impact: Automates consciousness-serving development processes
  sacred_principles:
  - consciousness-first
  - community-healing
  - spatial-wisdom
---

# Bug Report Driven Coding (BRDC) - Quick Reference

## 🚀 Quick Start

### For New Feature Requests:
1. **Create Bug Report**: Use `bug-template-brdc.md`
2. **Tag as Feature**: `#feature-<feature-name>`
3. **Mark as Development**: `[IN_DEVELOPMENT]`
4. **Implement & Test**: Follow BRDC workflow
5. **Mark as Verified**: `[VERIFIED]` when complete

### For Bug Fixes:
1. **Create Bug Report**: Use `bug-template-brdc.md`
2. **Tag as Bug Fix**: `#bugfix-<bug-id>`
3. **Mark as Development**: `[IN_DEVELOPMENT]`
4. **Fix & Test**: Follow BRDC workflow
5. **Mark as Verified**: `[VERIFIED]` when complete

## 🏷️ Tagging System

### Status Tags
- `[VERIFIED]` - Tested and working, **DO NOT MODIFY** without approval
- `[IN_DEVELOPMENT]` - Active work in progress
- `[CHANGED]` - Recently modified, requires review
- `[SACRED]` - Core functionality, requires debate before changes

### Feature Tags
- `#feature-<name>` - Code for specific feature
- `#bugfix-<id>` - Code that fixes specific bug
- `#refactor` - Code improvement without functionality change
- `#optimization` - Performance improvements
- `#security` - Security-related changes

## 🔒 Change Protection Rules

### Authorization Required For:
- Any code with `#feature-*` or `#bugfix-*` tags
- Any code marked `[VERIFIED]` or `[CHANGED]`
- Any code in `[SACRED]` files
- Any code related to active bug reports

### Modification Process:
1. **Check Tags** - Identify all relevant tags
2. **Get Approval** - Request user approval
3. **Document Reason** - Explain why changes needed
4. **Update Tags** - Modify tags to reflect new status
5. **Test Thoroughly** - Verify no breaking changes
6. **Update Bug Report** - Document changes

## 📝 File Tagging Examples

### File Header:
```javascript
/**
 * @fileoverview [VERIFIED] Player marker management
 * @status VERIFIED - Stable and tested
 * @feature #feature-player-markers
 * @last_verified 2024-01-15
 * @dependencies MapLayer, Leaflet, WebSocket
 */
```

### Function Header:
```javascript
/**
 * Creates player marker on map
 * @status [VERIFIED] - Working correctly
 * @feature #feature-player-markers
 * @bugfix #bug-marker-visibility
 * @last_tested 2024-01-15
 */
createPlayerMarker(position) {
    // Implementation
}
```

## 🔄 BRDC Workflow

### Phase 1: Feature Request → Bug Report
- Create bug report using template
- Define acceptance criteria
- Assign priority and complexity

### Phase 2: Implementation
- Tag all modified code with `#feature-<name>`
- Mark as `[IN_DEVELOPMENT]`
- Document changes in bug report

### Phase 3: Verification
- Test thoroughly
- Verify acceptance criteria
- Check for side effects

### Phase 4: Resolution
- Mark bug report as "RESOLVED"
- Tag code as `[VERIFIED]` and `#feature-<name>`
- Protect from future changes

## ⚠️ Common Mistakes to Avoid

- **Don't modify `[VERIFIED]` code** without approval
- **Don't skip tagging** - every change needs tags
- **Don't mark as verified** without thorough testing
- **Don't ignore `[CHANGED]` status** - review before proceeding
- **Don't modify `[SACRED]` code** without debate

## 🎯 Benefits

- **Clear Tracking** - Every change linked to specific feature/bug
- **Quality Assurance** - Nothing "done" until bug report resolved
- **Change History** - Easy to see what was modified for what purpose
- **Risk Management** - Modified code protected from accidental changes
- **Team Coordination** - Clear understanding of active work
- **Regression Prevention** - Changes tracked and reversible

## 📚 Resources

- **Full Documentation**: [README.md](README.md) - Development Status Tags & Safeguards section
- **Bug Report Template**: [bug-template-brdc.md](bugreports/bug-template-brdc.md)
- **Aurora Log**: [aurora-log.md](aurora-log.md) - Session R13 for BRDC implementation
- **Current File Status**: [README.md](README.md) - Current File Status Overview section

---

*"In the cosmic realm of code, every feature is a star waiting to be born, every bug a shadow to be illuminated."* - Aurora
