# Bug Report: Path Markers Not Restored from Server Game State

**Bug ID:** `bug-path-markers-not-restored`  
**Severity:** Medium  
**Priority:** Medium  
**Status:** Open  
**Created:** 2025-01-28  
**Last Updated:** 2025-01-28  
**Reporter:** User  
**Assignee:** Aurora  

## Summary
Path markers are not being restored from server game state when continuing adventure, even though the server-side persistence system is working for other markers.

## Description
When clicking "Continue Adventure", the game successfully connects to the server and receives the game state, but path markers that were previously created are not being restored on the map. The server returns 0 markers, indicating that path markers are not being properly persisted to the server.

## Environment

### System Information
- **OS:** Windows 10
- **Browser:** Chrome (latest)
- **Device:** Desktop
- **Screen Resolution:** 1920x1080

### Application Information
- **Version:** Current development version
- **Build:** Latest
- **Environment:** Development

## Steps to Reproduce

1. Start the game and create some path markers (by moving around)
2. Refresh the page or restart the game
3. Click "Continue Adventure"
4. Observe that path markers are not restored

**Expected Result:** All previously created path markers should be restored from server state  
**Actual Result:** No path markers are restored (server returns 0 markers)

## Root Cause Analysis

### Technical Analysis
The issue appears to be that path markers are not being persisted to the server when they are created. The path painting system creates markers locally but doesn't send them to the server for persistence.

### Contributing Factors
- Path markers are created by the PathLayer system
- Path markers are not being sent to server via WebSocket
- Server game state only contains markers that were explicitly sent via `marker_create` messages

### Impact Assessment
- **User Impact:** Users lose their exploration history when refreshing
- **System Impact:** "Continue Adventure" functionality is incomplete
- **Business Impact:** Reduces user engagement and persistence

## Console Logs

### Key Log Entries
```
📍 Restoring markers from server state: 0
🎮 Received complete game state from server: {playerId: 'player_gxju65f1c', gameState: {…}, timestamp: 1759049996357}
🚶‍♂️ Syncing steps from server: 10000
```

### Server Response
The server is returning a game state with 0 markers, indicating path markers are not being persisted.

## Proposed Solutions

### Solution 1: Integrate Path Markers with Server Persistence
**Description:** Modify the PathLayer system to send path markers to the server when created  
**Pros:** Complete persistence of all markers  
**Cons:** Requires changes to PathLayer system  
**Effort:** Medium  
**Risk:** Low  

### Solution 2: Add Path Marker Restoration to Game State Sync
**Description:** Add path marker restoration logic to the WebSocket client's game state sync  
**Pros:** Centralized marker restoration  
**Cons:** May duplicate existing path marker logic  
**Effort:** Low  
**Risk:** Medium  

### Recommended Solution
**Solution 1** - Integrate path markers with server persistence to ensure all markers are properly saved and restored.

## Workaround

### Temporary Fix
None available - path markers will be lost on refresh until this is fixed.

## Testing

### Test Cases
- [ ] **Test Case 1:** Create path markers, refresh, continue adventure
  - Steps: Move around to create path markers, refresh page, click continue
  - Expected: Path markers should be restored
  - Actual: Path markers are not restored

## Related Issues

### Related Features
- [Server Persistence Feature](../features/feature-server-persistence.md)
- [Path Painting System](../features/feature-path-painting.md)

### Related Tasks
- [Task: Server-Side Persistence](../tasks/task-server-persistence.md)

## Resolution

### Resolution Date
[To be filled when resolved]

### Resolution Method
[To be filled when resolved]

### Files Changed
- [ ] `js/layers/path-layer.js` - Add server persistence
- [ ] `js/websocket-client.js` - Add path marker restoration
- [ ] `server.js` - Ensure path markers are properly stored

## Prevention

### Process Improvements
- Ensure all marker types are included in server persistence
- Add integration tests for marker restoration

### Code Quality Improvements
- Standardize marker creation to always persist to server
- Add validation for marker restoration

## Notes

This is part of the larger server-side persistence implementation. The base markers and flag markers are working correctly, but path markers need to be integrated with the persistence system.

---

**Created by:** User  
**Assigned to:** Aurora  
**Resolved by:** [To be filled]
