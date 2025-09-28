# Bug Report: Base Marker Visibility Issue

**Bug ID:** `bug-base-marker-visibility`  
**Severity:** High  
**Status:** In Progress  
**Date:** 2025-01-27  
**Reporter:** AI Assistant (Aurora)  

## Summary
Base markers are not visible on the map despite successful creation and data persistence. The issue stems from architectural changes where MapEngine was not included in the new layered architecture system.

## Description
When users attempt to establish a base through the context menu or step currency system, the base data is successfully created and stored, but no visual marker appears on the map. Console logs show successful marker creation, but the marker is not rendered.

**Current Behavior:**
- Right-click context menu "🎯 Force Base Marker" creates data but no visual marker
- Step currency system `establishSimpleBase()` succeeds but marker invisible
- Console shows "Base marker created successfully" but nothing appears on map

**Expected Behavior:**
- Base markers should appear as red pulsing 🏗️ icons on the map
- Markers should be visible and interactive with popups
- Markers should persist across page reloads

## Root Cause Analysis
The issue was caused by architectural migration where the new layered architecture (`EldritchSanctuaryApp`) did not include MapEngine initialization, while the legacy app (`LegacyEldritchSanctuaryApp`) contained the MapEngine but wasn't being used.

**Technical Details:**
1. **App Architecture Conflict**: Two app classes running simultaneously
   - `EldritchSanctuaryApp` (new layered architecture) - missing MapEngine
   - `LegacyEldritchSanctuaryApp` (legacy) - contains MapEngine but not used

2. **MapEngine Reference Issues**: 
   - `window.mapEngine` was undefined in new architecture
   - Base marker creation attempted to use non-existent map instance
   - TerritoryLayer was used instead of direct map marker creation

3. **Layer System Confusion**:
   - TerritoryLayer is designed for territory visualization, not individual markers
   - MapLayer creates separate map instance, not the main visible map
   - Player marker uses `this.map` (MapEngine's internal reference)

## Steps to Reproduce
1. Load the application
2. Right-click on map to open context menu
3. Select "🎯 Force Base Marker"
4. Observe console logs showing successful creation
5. Notice no visual marker appears on map

**Console Output:**
```
🎯 Force creating base marker...
🎯 Using step currency system to create base marker
🏗️ Creating base marker on map at position: {lat: 61.4981, lng: 23.7608}
🏗️ Creating base marker using TerritoryLayer
🏰 TerritoryLayer: Added territory player-base
🏗️ Base territory created successfully using TerritoryLayer
🎯 Base marker created successfully via step currency system
```

## Console Logs
```
🔍 Testing map references from context menu...
window.mapEngine: undefined
window.mapEngine.map: undefined
Player marker: undefined
window.eldritchApp: EldritchSanctuaryApp {isInitialized: true, isMobile: false, eventBus: EventBus, gameState: GameState, layerManager: LayerManager, …}
Legacy app systems: undefined
Legacy app mapEngine: undefined
Global app variable: undefined
```

## Proposed Solutions
1. **✅ COMPLETED**: Add MapEngine to new layered architecture
   - Modified `js/core/app.js` to initialize MapEngine in `initCoreSystems()`
   - Set `window.mapEngine = this.mapEngine` for global access

2. **✅ COMPLETED**: Update base marker creation to use correct map instance
   - Use `window.mapEngine.map` directly (same as player marker)
   - Implement multilayered marker design matching player marker style
   - Set proper z-index and opacity for visibility

3. **PENDING**: Create multitool for map object insertion
   - Unified interface for adding markers, territories, NPCs, encounters
   - Support for different marker types and visual styles
   - Integration with existing layer system

## Impact
**High Impact** - Core base building functionality is broken, preventing users from:
- Establishing visual bases on the map
- Managing territory through base markers
- Engaging with base management features
- Experiencing the core gameplay loop

## Related Issues
- **Architecture Migration**: New layered architecture missing core systems
- **Layer System Design**: Need for unified map object insertion system
- **UI System Conflicts**: Multiple UI systems causing reference confusion

## Technical Implementation Details

### Files Modified:
- `js/core/app.js` - Added MapEngine initialization
- `js/context-menu-system.js` - Updated marker creation methods
- `js/step-currency-system.js` - Fixed map reference and marker creation

### Marker Creation Method:
```javascript
// Use same approach as player marker
const baseIcon = L.divIcon({
    className: 'base-marker multilayered',
    html: `<div style="position: relative; width: 40px; height: 40px;">
        <!-- Base aura -->
        <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; 
             background: radial-gradient(circle, #ff000040 0%, transparent 70%); 
             border-radius: 50%; animation: basePulse 2s infinite;"></div>
        <!-- Base body -->
        <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; 
             background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; 
             box-shadow: 0 0 10px #ff000080;"></div>
        <!-- Base emoji -->
        <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; 
             display: flex; align-items: center; justify-content: center; font-size: 18px; 
             text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const baseMarker = L.marker([position.lat, position.lng], { 
    icon: baseIcon,
    zIndexOffset: 2000
}).addTo(window.mapEngine.map);
```

## Testing Status
- **MapEngine Integration**: ✅ Added to new architecture
- **Marker Creation**: ✅ Updated to use correct map instance
- **Visual Styling**: ✅ Implemented multilayered design
- **Global Access**: ✅ Set window.mapEngine reference
- **User Testing**: ⏳ Pending page refresh and validation

## Next Steps
1. **Validate Fix**: Test base marker creation after page refresh
2. **Create Multitool**: Develop unified map object insertion system
3. **Document Architecture**: Update architecture docs with MapEngine integration
4. **Test Edge Cases**: Verify markers persist across page reloads
5. **Performance Check**: Ensure marker creation doesn't impact performance

## Notes
This bug highlights the importance of maintaining architectural consistency during migration projects. The new layered architecture should include all core systems from the legacy implementation to ensure feature parity and user experience continuity.

The solution demonstrates the need for a unified map object insertion system that can handle different types of markers (bases, NPCs, encounters, territories) through a consistent interface, reducing the complexity of marker management across different systems.
