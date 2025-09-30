# 🎭 Interactions & Reaction Ribbon
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-INTERACTIONS-RIBBON  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🌸 Reaction Ribbon Design (11 Types)

### **Reaction Types (v1 Canon)**
```typescript
export type ReactionType =
  | 'rose'      // 💖 main like
  | 'diamond'   // 💎 premium/valuable
  | 'owl'       // 🦉 wisdom
  | 'health'    // 🏥 healing
  | 'science'   // 🔬 scientific
  | 'comedy'    // 😄 humor
  | 'sheriff'   // 👮 community policing
  | 'confusing' // 🤔 confusion
  | 'dislike'   // 👎 dislike
  | 'troll'     // 🧌 trolling
  | 'coffin';   // ⚰️ bury
```

### **Reaction Palette Colors**
```typescript
export const ReactionPalette: Record<ReactionType, RGB[]> = {
  rose: [[255,92,139],[255,155,190],[255,110,160]],        // Pink tones
  diamond: [[255,255,255],[235,245,255]],                  // White/blue-white
  owl: [[61,90,128],[129,178,209]],                        // Blue-gray tones
  health: [[88,196,153],[56,160,120]],                     // Green tones
  science: [[77,144,255],[140,190,255]],                   // Blue tones
  comedy: [[255,200,50],[255,235,120]],                    // Yellow tones
  sheriff: [[120,185,255],[180,220,255]],                 // Light blue
  confusing: [[180,180,180],[210,210,210]],                // Gray tones
  dislike: [[140,140,140],[100,100,100]],                  // Dark gray
  troll: [[220,120,70],[255,165,95]],                      // Orange tones
  coffin: [[80,80,90],[120,120,130]]                       // Dark gray-brown
};
```

### **Reaction Order (Canonical)**
The reaction ribbon displays reactions in this specific order:
1. **rose** 💖 - Main like
2. **diamond** 💎 - Premium/valuable
3. **owl** 🦉 - Wisdom
4. **health** 🏥 - Healing
5. **science** 🔬 - Scientific
6. **comedy** 😄 - Humor
7. **sheriff** 👮 - Community policing
8. **confusing** 🤔 - Confusion
9. **dislike** 👎 - Dislike
10. **troll** 🧌 - Trolling
11. **coffin** ⚰️ - Bury

---

## 💪 Double-Interactions Logic

### **Strength System**
- **Strength 1**: Single interaction (default)
- **Strength 2**: Double interaction (distinct UI & counts)

### **Double Interaction Behavior**
```typescript
interface ReactionInteraction {
  type: ReactionType;
  strength: 1 | 2;
  userReaction: ReactionType | null;
  countsByType: Record<ReactionType, { total: number; strength1: number; strength2: number }>;
}
```

### **Double Interaction Rules**
- **First click**: Sets strength to 1
- **Second click**: Upgrades to strength 2
- **Third click**: Removes reaction (Phase D feature)
- **Different reaction**: Replaces current reaction with strength 1

### **Count Aggregation**
```sql
-- Reaction counts with strength breakdown
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN strength = 1 THEN 1 END) as strength1,
  COUNT(CASE WHEN strength = 2 THEN 1 END) as strength2
FROM reactions 
WHERE comment_id = ? 
GROUP BY type;
```

---

## 🎨 Animations & Tooltip System

### **ReactionRibbon.svelte Props**
```typescript
interface ReactionRibbonProps {
  countsByType: Record<ReactionType, { total: number; strength1: number; strength2: number }>;
  userReaction: { type: ReactionType; strength: 1 | 2 } | null;
  disabled?: boolean;
  immersionLevel: 'Low' | 'Default' | 'High';
}
```

### **ReactionRibbon.svelte Events**
```typescript
interface ReactionRibbonEvents {
  toggle: (event: { type: ReactionType; nextStrength: 1 | 2 }) => void;
}
```

### **Hover Animations**
- **Hover Breathe**: Subtle scale animation on hover
- **Tooltip**: Shows reaction name and count
- **Strength 2 Burst**: Bigger growth + themed burst + text pop ("DOUBLE ROSE" etc)

### **Tooltip Content**
```typescript
const tooltipContent = {
  rose: "Like this comment",
  diamond: "This is valuable",
  owl: "This is wise",
  health: "This is healing",
  science: "This is scientific",
  comedy: "This is funny",
  sheriff: "This needs attention",
  confusing: "This is confusing",
  dislike: "I don't like this",
  troll: "This is trolling",
  coffin: "Bury this comment"
};
```

### **Mobile Long-Press**
- **Long-press**: Shows tooltip on mobile devices
- **Touch feedback**: Haptic feedback on supported devices
- **Accessibility**: Screen reader support for reaction names

---

## 🎯 Resource/Topic Interactions & Rules

### **Resource-Level Reactions**
```sql
-- Same schema as comment reactions
CREATE TABLE resource_reactions (
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type NOT NULL,
    strength SMALLINT CHECK (strength IN (1, 2)) DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (resource_id, user_id, type)
);
```

### **Resource Reaction Rules**
- **Same 11 types**: Identical to comment reactions
- **Same strength system**: 1 | 2 strength levels
- **Same UI behavior**: Hover breathe, tooltips, bursts
- **Aggregate display**: Shows total counts in resource feed

### **Topic-Level Reactions**
- **Optional feature**: Topics can have reactions if implemented
- **Same schema**: Mirrors resource reactions
- **Same UI**: Identical interaction patterns

### **Interaction Permissions**
```sql
-- RLS for reactions
CREATE POLICY "Reactions public read" ON reactions FOR SELECT USING (true);
CREATE POLICY "Reactions owner write" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reactions owner delete" ON reactions FOR DELETE USING (auth.uid() = user_id);
```

---

## 🎨 Visual Design System

### **Reaction Button States**
```css
.reaction-button {
  /* Base state */
  transition: all 0.2s ease;
  border-radius: 50%;
  padding: 8px;
}

.reaction-button:hover {
  /* Hover state */
  transform: scale(1.1);
  filter: brightness(1.2);
}

.reaction-button.active {
  /* Active state */
  background: var(--reaction-color);
  color: white;
}

.reaction-button.strength-2 {
  /* Double strength state */
  transform: scale(1.2);
  box-shadow: 0 0 20px var(--reaction-color);
}
```

### **Burst Animation**
```typescript
// Strength 2 burst animation
const createBurst = (reactionType: ReactionType, x: number, y: number) => {
  const palette = ReactionPalette[reactionType];
  const burst = {
    x, y,
    particles: Array.from({ length: 12 }, () => ({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 0,
      maxLife: 0.8,
      hue: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.8,
      size: 2 + Math.random() * 3
    }))
  };
  return burst;
};
```

### **Text Pop Animation**
```css
.reaction-text-pop {
  position: absolute;
  font-weight: bold;
  font-size: 14px;
  color: var(--reaction-color);
  animation: textPop 0.6s ease-out;
}

@keyframes textPop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}
```

---

## 🔧 API Endpoints

### **Comment Reactions**
```typescript
// POST /api/comments/:id/reactions
interface ReactionRequest {
  type: ReactionType;
  strength: 1 | 2;
}

// Response
interface ReactionResponse {
  success: boolean;
  reaction: {
    type: ReactionType;
    strength: 1 | 2;
    counts: Record<ReactionType, { total: number; strength1: number; strength2: number }>;
  };
}
```

### **Resource Reactions**
```typescript
// POST /api/resources/:id/reactions
interface ResourceReactionRequest {
  type: ReactionType;
  strength: 1 | 2;
}

// Response
interface ResourceReactionResponse {
  success: boolean;
  reaction: {
    type: ReactionType;
    strength: 1 | 2;
    counts: Record<ReactionType, { total: number; strength1: number; strength2: number }>;
  };
}
```

### **Reaction Removal (Phase D)**
```typescript
// DELETE /api/comments/:id/reactions/:type
// DELETE /api/resources/:id/reactions/:type
// Not implemented in MVP - Phase D feature
```

---

## 🎯 Performance Requirements

### **Animation Performance**
- **60fps**: All animations must maintain 60fps on mid-phone devices
- **GPU acceleration**: Use transform3d for smooth animations
- **Reduced motion**: Respect `prefers-reduced-motion` setting
- **Burst optimization**: Limit concurrent bursts to prevent frame drops

### **API Performance**
- **<50ms**: Reaction API responses must be under 50ms p95
- **Batch updates**: Group multiple reaction changes
- **Optimistic updates**: Update UI immediately, rollback on error
- **Caching**: Cache reaction counts for frequently accessed content

### **Mobile Optimization**
- **Touch targets**: Minimum 44px touch targets
- **Long-press**: 500ms long-press for tooltips
- **Haptic feedback**: Use device haptics for reaction feedback
- **Battery efficiency**: Pause animations when tab is hidden

---

## 🧪 Testing Requirements

### **Unit Tests**
- **Reaction logic**: Test strength 1→2 progression
- **Count aggregation**: Test reaction count calculations
- **UI states**: Test hover, active, disabled states
- **Animations**: Test burst and text-pop animations

### **Integration Tests**
- **API endpoints**: Test reaction creation/updates
- **Database**: Test reaction storage and retrieval
- **RLS policies**: Test reaction permissions
- **Real-time updates**: Test reaction synchronization

### **Performance Tests**
- **Animation performance**: Test 60fps requirement
- **API performance**: Test <50ms response time
- **Memory usage**: Test burst animation memory management
- **Battery impact**: Test animation battery consumption

---

## 🎨 Accessibility

### **Screen Reader Support**
- **ARIA labels**: Each reaction button has descriptive labels
- **Live regions**: Announce reaction count changes
- **Keyboard navigation**: Full keyboard support for reactions
- **Focus management**: Clear focus indicators

### **Visual Accessibility**
- **Color contrast**: Meet WCAG AA standards
- **High contrast mode**: Support system high contrast
- **Reduced motion**: Respect user motion preferences
- **Large text**: Support system font scaling

### **Motor Accessibility**
- **Touch targets**: Minimum 44px touch targets
- **Gesture alternatives**: Provide button alternatives to gestures
- **Timing**: Adequate time for interactions
- **Error prevention**: Confirm destructive actions

This reaction system provides a rich, accessible, and performant way for users to express their feelings about content while maintaining the sacred principles of community healing and consciousness awareness.
