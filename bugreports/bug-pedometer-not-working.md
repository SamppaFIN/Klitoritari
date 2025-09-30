# Bug Report: Pedometer Not Working

**Bug ID:** `bug-pedometer-not-working`  
**Severity:** High  
**Status:** In Progress  
**Date:** 2025-01-29  
**Reporter:** Infinite  

## Summary

The pedometer/step counter is not working properly, preventing players from earning steps through movement. This blocks core gameplay progression and milestone achievements.

## Description

### Current Behavior
- Step counter shows 0 or very low step counts
- Device motion events not firing consistently
- GPS-based step estimation not implemented
- No fallback methods for step counting
- Players cannot progress through the game

### Expected Behavior
- Steps should be counted through multiple methods:
  - Device motion/accelerometer (primary)
  - GPS distance estimation (fallback)
  - Gyroscope detection (fallback)
  - Google Fit integration (optional)
  - Time-based simulation (last resort)

## Root Cause Analysis

### 1. Device Motion Issues
**Location:** `js/step-currency-system.js:525-576`

The current device motion setup has several issues:
- Requires HTTPS for mobile devices
- Permission requests may fail
- Acceleration threshold may be too high
- No proper error handling for unsupported devices

### 2. No Fallback Methods
**Location:** `js/step-currency-system.js:2680-2690`

The system only tries device motion and has no fallback:
- No GPS distance-based estimation
- No gyroscope-based detection
- No Google Fit integration
- Fallback mode is disabled

### 3. Step Detection Logic
**Location:** `js/step-currency-system.js:1238-1250`

The step detection logic is flawed:
- Auto step detection is disabled by default
- Step validation is too strict
- No alternative step counting methods

## Proposed Solutions

### 1. Enhanced Step Tracking System ✅ (Implemented)
- **File:** `js/enhanced-step-tracking.js`
- **Features:**
  - Multiple tracking methods with priority order
  - GPS distance-based step estimation
  - Gyroscope-based step detection
  - Google Fit API integration
  - Fallback time-based simulation
  - Configurable step length based on user height

### 2. Integration with Existing System
- **File:** `js/step-currency-system.js` (modify)
- **Changes:**
  - Replace current step detection with enhanced system
  - Maintain existing milestone system
  - Add method switching and debugging
  - Preserve existing step data

### 3. Offline Mode Implementation
- **Features:**
  - GPS distance calculation between markers
  - Step estimation based on traveled distance
  - Position history tracking
  - Accuracy-based step validation

## Implementation Plan

### Phase 1: Enhanced Step Tracking ✅ (Complete)
- [x] Create `js/enhanced-step-tracking.js`
- [x] Implement multiple tracking methods
- [x] Add GPS distance-based estimation
- [x] Add gyroscope detection
- [x] Add Google Fit integration
- [x] Add fallback mode

### Phase 2: Integration (Next)
- [ ] Modify `js/step-currency-system.js` to use enhanced tracking
- [ ] Add method switching UI
- [ ] Add debugging tools
- [ ] Test all tracking methods

### Phase 3: Testing & Optimization
- [ ] Test on various devices
- [ ] Optimize step length calculations
- [ ] Add user height configuration
- [ ] Performance testing

## Testing Strategy

### Unit Tests
- [ ] Test GPS distance calculations
- [ ] Test step length estimations
- [ ] Test method switching logic
- [ ] Test fallback mode

### Integration Tests
- [ ] Test with existing milestone system
- [ ] Test with base building system
- [ ] Test with quest system
- [ ] Test data persistence

### Manual Testing
- [ ] Test on mobile devices (Android/iOS)
- [ ] Test with different GPS accuracies
- [ ] Test offline mode
- [ ] Test method fallbacks

## Acceptance Criteria
- [ ] Steps are counted through at least one method
- [ ] GPS distance estimation works offline
- [ ] Method switching works seamlessly
- [ ] Existing milestone system continues to work
- [ ] Performance is acceptable on mobile devices
- [ ] Step data persists across sessions

## Related Files
- `js/step-currency-system.js` - Main step system
- `js/enhanced-step-tracking.js` - New enhanced system
- `js/geolocation.js` - GPS position tracking
- `index.html` - UI integration

## Notes
This is a critical bug that blocks core gameplay. The enhanced step tracking system provides multiple fallback methods to ensure steps are always counted, even when the primary pedometer fails.

The system should be robust enough to work in various conditions:
- Poor GPS signal
- No device motion support
- Background app state
- Offline mode
