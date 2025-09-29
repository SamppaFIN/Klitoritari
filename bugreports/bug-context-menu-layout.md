# Bug Report: Context Menu Layout Issue

**Bug ID:** `bug-context-menu-layout`  
**Type:** Bug  
**Priority:** Medium  
**Status:** New  
**Assignee:** Aurora  
**Created:** January 28, 2025  
**Last Updated:** January 28, 2025  
**Estimated Effort:** 1-2 hours  

## Summary
The "Move Here" button in the context menu is floating over other menu items, specifically overlapping the text of the "Force Base Marker" option below it. This creates a visual layout issue where buttons are not properly contained within their designated space.

## Description
When users right-click on the map to open the context menu, the "Move Here" button (with rocket icon) appears to float over the subsequent menu items instead of being properly contained within its own row. The button visually overlaps the text of the "Force Base Marker" option directly below it.

## Visual Evidence
- **Issue**: "Move Here" button overlaps "Force Base Marker" text
- **Location**: Right side of map context menu
- **Affected Elements**: Button positioning and text visibility

## Requirements

### Functional Requirements
- [ ] All context menu buttons should be properly contained within their designated rows
- [ ] No visual overlap between menu items
- [ ] All text should be fully visible and readable
- [ ] Buttons should have consistent spacing and alignment

### Non-Functional Requirements
- [ ] Context menu should maintain consistent visual hierarchy
- [ ] Menu should be usable on both desktop and mobile devices
- [ ] Layout should be responsive to different screen sizes

## Acceptance Criteria
- [ ] "Move Here" button does not overlap other menu items
- [ ] All menu text is fully visible and readable
- [ ] Consistent spacing between all menu items
- [ ] Context menu maintains proper visual hierarchy

## Dependencies
- **Context Menu System** - `js/context-menu-system.js` - Menu rendering and styling
- **CSS Styling** - `styles.css` - Context menu layout styles

## Technical Details

### Current Context Menu Structure
The context menu contains the following items:
1. "Move Here" (rocket icon) - **OVERLAPPING ISSUE**
2. "Force Base Marker" (base icon)
3. "Create Quest Marker" (quest scroll icon)
4. "Create NPC Marker" (NPC character icon)
5. "Create Monster Marker" (monster head icon)
6. "Create POI Marker" (location pin icon)
7. "Create Test Marker" (green checkmark icon)
8. "Check Location" (information icon)
9. "Close" (red 'X' icon)

### Suspected Root Cause
- **CSS Layout Issue**: Button positioning not properly constrained
- **Z-Index Problem**: Button may have higher z-index than text
- **Padding/Margin Issue**: Insufficient spacing between menu items
- **Flexbox/Grid Issue**: Layout container not properly configured

## Related Files
- `js/context-menu-system.js` - Context menu rendering logic
- `styles.css` - Context menu styling and layout

## Testing Strategy

### Manual Testing
1. **Desktop Testing**
   - Right-click on map to open context menu
   - Verify all buttons are properly contained
   - Check for any overlapping elements
   - Test menu functionality

2. **Mobile Testing**
   - Test context menu on mobile device
   - Verify touch interactions work properly
   - Check layout on different screen sizes

## Next Steps

### Immediate Actions
1. **Investigate CSS Layout** - Check context menu styling for positioning issues
2. **Fix Button Positioning** - Ensure proper containment within menu rows
3. **Test Layout Fix** - Verify no overlapping elements
4. **Test Responsiveness** - Ensure layout works on different screen sizes

### Future Improvements
1. **Improve Menu Styling** - Enhance visual design and spacing
2. **Add Menu Animations** - Smooth transitions and hover effects
3. **Optimize Mobile Layout** - Better mobile-specific styling

## Notes

### Related to Base Marker Issue
This layout issue is separate from the base marker visibility problem but affects the same context menu system. Both issues should be addressed to ensure a fully functional context menu experience.

### Priority
While this is a visual issue, it affects usability and should be fixed alongside the base marker positioning problem.

---

**Last Updated**: January 28, 2025  
**Next Review**: After layout fix is implemented and tested
