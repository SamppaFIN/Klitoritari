# Task: Fix Complete Marker and Position Persistence

**Task ID:** `task-fix-marker-persistence`  
**Type:** Bugfix  
**Priority:** High  
**Status:** Open  
**Assignee:** Aurora  
**Created:** 2025-01-28  
**Last Updated:** 2025-01-28  
**Estimated Effort:** 6-8 hours  

## Summary
ALL markers (path, step, base) and player position are not being properly persisted to the server, causing them to disappear when refreshing the page and continuing adventure.

## Description
Currently, the system creates various markers and tracks player position but doesn't persist them to the server:
- **Path markers** (Finnish flags) via `window.mapEngine.dropFlagHere()`
- **Step markers** (numbered markers) via the teleportation system  
- **Base markers** via base establishment system
- **Player position** via geolocation updates

These are created/tracked locally but are never sent to the server for persistence. When the player refreshes and continues adventure, the server returns 0 markers and no position data because nothing was ever saved.

## Requirements

### Functional Requirements
- [ ] Path markers should be persisted to server when created
- [ ] Step markers should be persisted to server when created
- [ ] Base markers should be persisted to server when created
- [ ] Player position should be persisted to server when updated
- [ ] All markers should be restored from server when continuing adventure
- [ ] Player position should be restored from server when continuing adventure
- [ ] Markers should be restored in correct positions and with correct properties

### Non-Functional Requirements
- [ ] Performance: No significant impact on marker creation speed
- [ ] Reliability: Markers should persist across page refreshes
- [ ] Consistency: Same persistence pattern as base markers

## Acceptance Criteria
- [ ] Path markers created via teleportation are saved to server
- [ ] Step markers created via teleportation are saved to server
- [ ] Base markers created via base establishment are saved to server
- [ ] Player position updates are saved to server
- [ ] All markers are restored when continuing adventure
- [ ] Player position is restored when continuing adventure
- [ ] Markers appear in correct positions after restoration
- [ ] No duplicate markers are created

## Implementation Plan

### Phase 1: Update Path Marker Creation
- [ ] Modify `dropFlagHere()` method in `map-engine.js` to send marker data to server
- [ ] Use `window.websocketClient.createMarker()` for path markers
- [ ] Ensure path markers are stored in server game state

### Phase 2: Update Step Marker Creation
- [ ] Modify step marker creation in teleportation system
- [ ] Send step markers to server via WebSocket
- [ ] Store step markers in server game state

### Phase 3: Update Marker Restoration
- [ ] Ensure `restoreMarkersFromServer()` handles both path and step markers
- [ ] Add proper marker type identification
- [ ] Restore markers with correct visual properties

### Phase 4: Testing
- [ ] Test marker creation and persistence
- [ ] Test marker restoration on page refresh
- [ ] Test marker restoration when continuing adventure
- [ ] Verify no duplicate markers

## Technical Details

### Files to Modify
- [ ] `js/map-engine.js` - Update `dropFlagHere()` method
- [ ] `js/step-currency-system.js` - Update step marker creation
- [ ] `js/websocket-client.js` - Ensure marker restoration works
- [ ] `server.js` - Verify marker storage in game state

### New Files to Create
- [ ] None

### Database Changes
- [ ] None (using in-memory database)

### API Changes
- [ ] Use existing `marker_create` WebSocket message
- [ ] Use existing `marker_added` WebSocket response

## Testing Strategy

### Unit Tests
- [ ] Test path marker creation with server persistence
- [ ] Test step marker creation with server persistence
- [ ] Test marker restoration from server

### Integration Tests
- [ ] Test complete flow: create markers → refresh → continue adventure
- [ ] Test marker persistence across multiple sessions

### Manual Testing
- [ ] Create markers via teleportation
- [ ] Refresh page and continue adventure
- [ ] Verify all markers are restored
- [ ] Test with different marker types

## Dependencies

### Internal Dependencies
- [ ] WebSocket client system
- [ ] Server-side game state database
- [ ] Map layer system

### External Dependencies
- [ ] None

## Risks & Mitigation

### Technical Risks
- **Risk 1:** Marker creation becomes slower - *Mitigation: Use async operations*
- **Risk 2:** Server overload with many markers - *Mitigation: Implement marker limits*

### Schedule Risks
- **Risk 1:** Complex integration issues - *Mitigation: Start with simple implementation*

## Related Items

### Related Bugs
- [Bug: Path Markers Not Restored](../bugs/bug-path-markers-not-restored.md)

### Related Features
- [Server Persistence Feature](../features/feature-server-persistence.md)

## Notes

This is a critical fix for the "Continue Adventure" functionality. Currently, players lose all their exploration markers when refreshing the page, which significantly impacts the user experience.

The fix should follow the same pattern as base markers, which are already working correctly with server persistence.

---

**Created by:** Aurora  
**Assigned to:** Aurora
