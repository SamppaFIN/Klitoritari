# 🔔 Notifications & Activity
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-NOTIFICATIONS  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 📱 Activity Panel

### **Activity Types**
```typescript
interface ActivityItem {
  id: string;
  user_id: string; // recipient
  kind: 'mention' | 'reply' | 'follow' | 'mod';
  subject_type: string;
  subject_id: string;
  created_at: Date;
  seen_at?: Date;
  isUnseen: boolean;
}

interface ActivityPanelProps {
  activities: ActivityItem[];
  onMarkAsSeen: (activityId: string) => void;
  onMarkAllAsSeen: () => void;
}
```

### **Activity Panel UI**
```typescript
const ActivityPanel: SvelteComponent = {
  props: ['activities', 'onMarkAsSeen', 'onMarkAllAsSeen'],
  template: `
    <div class="activity-panel">
      <div class="panel-header">
        <h3>Activity</h3>
        <button on:click={onMarkAllAsSeen}>Mark All as Seen</button>
      </div>
      
      <div class="activity-list">
        {#each activities as activity}
          <div class="activity-item" class:unseen={activity.isUnseen}>
            <div class="activity-icon">
              {#if activity.kind === 'mention'}
                <span class="mention-icon">@</span>
              {:else if activity.kind === 'reply'}
                <span class="reply-icon">↩</span>
              {:else if activity.kind === 'follow'}
                <span class="follow-icon">+</span>
              {:else if activity.kind === 'mod'}
                <span class="mod-icon">🛡</span>
              {/if}
            </div>
            
            <div class="activity-content">
              <p class="activity-text">
                {activity.kind === 'mention' && 'You were mentioned in a comment'}
                {activity.kind === 'reply' && 'Someone replied to your comment'}
                {activity.kind === 'follow' && 'Someone started following you'}
                {activity.kind === 'mod' && 'Moderation action on your content'}
              </p>
              <p class="activity-time">{formatTime(activity.created_at)}</p>
            </div>
            
            <div class="activity-actions">
              <button on:click={() => onMarkAsSeen(activity.id)}>Mark as Seen</button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  `
};
```

---

## 👁️ Visual Pulses

### **Aura Pulse System**
```typescript
interface AuraPulse {
  intensity: number; // 0-1
  color: string;
  duration: number; // ms
  frequency: number; // pulses per second
}

class AuraPulseRenderer {
  private pulses: AuraPulse[] = [];
  
  createPulse(intensity: number, color: string, duration: number = 2000) {
    const pulse: AuraPulse = {
      intensity,
      color,
      duration,
      frequency: 2 // 2 pulses per second
    };
    
    this.pulses.push(pulse);
    this.startPulseAnimation(pulse);
  }
  
  private startPulseAnimation(pulse: AuraPulse) {
    const element = document.querySelector('.activity-panel');
    if (!element) return;
    
    element.style.boxShadow = `0 0 20px ${pulse.color}`;
    element.style.animation = `auraPulse ${pulse.duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.boxShadow = '';
      element.style.animation = '';
      this.pulses = this.pulses.filter(p => p !== pulse);
    }, pulse.duration);
  }
}
```

### **CSS Animations**
```css
@keyframes auraPulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.activity-panel.unseen {
  animation: auraPulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}
```

---

## 👥 Mentions MVP

### **Mention Parsing**
```typescript
interface Mention {
  username: string;
  startIndex: number;
  endIndex: number;
  userId?: string;
}

class MentionParser {
  private mentionRegex = /@(\w+)/g;
  
  parseMentions(text: string): Mention[] {
    const mentions: Mention[] = [];
    let match;
    
    while ((match = this.mentionRegex.exec(text)) !== null) {
      mentions.push({
        username: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
    
    return mentions;
  }
  
  async resolveMentions(mentions: Mention[]): Promise<Mention[]> {
    const resolvedMentions = await Promise.all(
      mentions.map(async (mention) => {
        const user = await this.findUserByUsername(mention.username);
        return {
          ...mention,
          userId: user?.id
        };
      })
    );
    
    return resolvedMentions.filter(m => m.userId);
  }
}
```

### **Mention UI Components**
```typescript
interface MentionProps {
  mention: Mention;
  onBlock: (userId: string) => void;
  onFollow: (userId: string) => void;
}

const Mention: SvelteComponent = {
  props: ['mention', 'onBlock', 'onFollow'],
  template: `
    <span class="mention" class:resolved={mention.userId}>
      @{mention.username}
    </span>
  `
};

interface MentionTooltipProps {
  user: UserProfile;
  onBlock: (userId: string) => void;
  onFollow: (userId: string) => void;
}

const MentionTooltip: SvelteComponent = {
  props: ['user', 'onBlock', 'onFollow'],
  template: `
    <div class="mention-tooltip">
      <div class="tooltip-header">
        <img src={user.avatar} alt={user.username} />
        <div class="user-info">
          <h4>{user.username}</h4>
          <p>{user.bio}</p>
        </div>
      </div>
      
      <div class="tooltip-actions">
        <button on:click={() => onFollow(user.id)}>Follow</button>
        <button on:click={() => onBlock(user.id)} class="danger">Block</button>
      </div>
    </div>
  `
};
```

---

## 🚫 Block System

### **Block Implementation**
```typescript
interface BlockedUser {
  id: string;
  username: string;
  blockedAt: Date;
  reason?: string;
}

class BlockManager {
  private blockedUsers: Set<string> = new Set();
  
  async blockUser(userId: string, reason?: string): Promise<void> {
    // Add to blocked users set
    this.blockedUsers.add(userId);
    
    // Store in database
    await this.storeBlock(userId, reason);
    
    // Update UI
    this.updateUI();
  }
  
  async unblockUser(userId: string): Promise<void> {
    // Remove from blocked users set
    this.blockedUsers.delete(userId);
    
    // Remove from database
    await this.removeBlock(userId);
    
    // Update UI
    this.updateUI();
  }
  
  isBlocked(userId: string): boolean {
    return this.blockedUsers.has(userId);
  }
  
  private async storeBlock(userId: string, reason?: string): Promise<void> {
    // Store block in database
    await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason })
    });
  }
  
  private async removeBlock(userId: string): Promise<void> {
    // Remove block from database
    await fetch(`/api/blocks/${userId}`, {
      method: 'DELETE'
    });
  }
}
```

### **Block UI Components**
```typescript
interface BlockedUsersListProps {
  blockedUsers: BlockedUser[];
  onUnblock: (userId: string) => void;
}

const BlockedUsersList: SvelteComponent = {
  props: ['blockedUsers', 'onUnblock'],
  template: `
    <div class="blocked-users-list">
      <h3>Blocked Users</h3>
      
      {#each blockedUsers as user}
        <div class="blocked-user-item">
          <div class="user-info">
            <img src={user.avatar} alt={user.username} />
            <div class="user-details">
              <h4>{user.username}</h4>
              <p>Blocked {formatDate(user.blockedAt)}</p>
              {#if user.reason}
                <p class="block-reason">Reason: {user.reason}</p>
              {/if}
            </div>
          </div>
          
          <div class="user-actions">
            <button on:click={() => onUnblock(user.id)} class="unblock-button">
              Unblock
            </button>
          </div>
        </div>
      {/each}
    </div>
  `
};
```

---

## 🔔 Notification Settings

### **Notification Preferences**
```typescript
interface NotificationSettings {
  mentions: boolean;
  replies: boolean;
  follows: boolean;
  moderation: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  channels: ('visual' | 'email' | 'push')[];
}

const NotificationSettings: SvelteComponent = {
  props: ['settings', 'onUpdate'],
  template: `
    <div class="notification-settings">
      <h3>Notification Preferences</h3>
      
      <div class="notification-types">
        <label>
          <input type="checkbox" bind:checked={settings.mentions}>
          Mentions (@username)
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.replies}>
          Replies to your comments
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.follows}>
          New followers
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.moderation}>
          Moderation actions
        </label>
      </div>
      
      <div class="notification-frequency">
        <label>
          Frequency:
          <select bind:value={settings.frequency}>
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
        </label>
      </div>
      
      <div class="notification-channels">
        <label>
          <input type="checkbox" bind:checked={settings.channels.includes('visual')}>
          Visual notifications
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.channels.includes('email')}>
          Email notifications
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.channels.includes('push')}>
          Push notifications
        </label>
      </div>
    </div>
  `
};
```

---

## 🔧 API Endpoints

### **Activity Endpoints**
```typescript
// GET /api/activity?after=timestamp&limit=20
interface ActivityResponse {
  activities: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// POST /api/activity/:id/seen
interface MarkAsSeenResponse {
  success: boolean;
  activity: ActivityItem;
}

// POST /api/activity/seen-all
interface MarkAllAsSeenResponse {
  success: boolean;
  markedCount: number;
}
```

### **Mention Endpoints**
```typescript
// POST /api/mentions
interface CreateMentionRequest {
  commentId: string;
  mentionedUserId: string;
}

// GET /api/mentions/blocked
interface BlockedMentionsResponse {
  blockedUsers: BlockedUser[];
  total: number;
}
```

### **Block Endpoints**
```typescript
// POST /api/blocks
interface BlockUserRequest {
  userId: string;
  reason?: string;
}

// DELETE /api/blocks/:userId
interface UnblockUserResponse {
  success: boolean;
  userId: string;
}

// GET /api/blocks
interface BlockedUsersResponse {
  blockedUsers: BlockedUser[];
  total: number;
}
```

---

## 🎯 Performance Requirements

### **Activity Panel Performance**
- **<50ms**: Activity panel load time
- **<25ms**: Mark as seen response time
- **Real-time**: Live updates for new activities
- **Pagination**: Efficient pagination for large activity lists

### **Mention Performance**
- **<100ms**: Mention parsing and resolution
- **<50ms**: Mention tooltip display
- **Caching**: Cache user lookups for mentions
- **Debouncing**: Debounce mention parsing for performance

### **Block Performance**
- **<25ms**: Block/unblock response time
- **Client-side**: Immediate UI updates
- **Optimistic**: Update UI before server confirmation
- **Caching**: Cache blocked users list

---

## 🧪 Testing Requirements

### **Activity Tests**
- **Activity creation**: Test activity item creation
- **Visual pulses**: Test aura pulse animations
- **Mark as seen**: Test mark as seen functionality
- **Real-time updates**: Test live activity updates

### **Mention Tests**
- **Mention parsing**: Test @username parsing
- **User resolution**: Test user lookup for mentions
- **Tooltip display**: Test mention tooltip functionality
- **Block integration**: Test mention blocking

### **Block Tests**
- **Block functionality**: Test user blocking
- **Unblock functionality**: Test user unblocking
- **Block persistence**: Test block persistence
- **UI updates**: Test block UI updates

This notification and activity system provides a rich, real-time experience that keeps users engaged while respecting their privacy and preferences.
