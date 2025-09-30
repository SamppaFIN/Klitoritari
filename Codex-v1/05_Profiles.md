# 👤 Profiles & AuraRing
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-PROFILES  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 👤 Profile Pages

### **Profile Structure**
```typescript
interface UserProfile {
  id: string;
  username: string;
  bio: string;
  mood_emoji: string;
  supporter: boolean;
  auraRing: AuraRing;
  tabs: ProfileTab[];
}

interface ProfileTab {
  id: 'overview' | 'articles' | 'activity' | 'ael';
  label: string;
  content: ReactNode;
}
```

### **Profile Tabs**
- **Overview**: Aura, bio, basic stats
- **Articles**: User's article-comments
- **Activity**: User's activity feed
- **ÆL**: Personal ÆtherLens insights (read-only)

---

## 💍 AuraRing System

### **Base Aura Colors**
```typescript
interface AuraRing {
  baseColor: string; // Based on positivity/negativity
  microBands: MicroBand[];
  size: 'small' | 'medium' | 'large';
  animation: 'pulse' | 'glow' | 'static';
}

interface MicroBand {
  type: 'writer' | 'supporter';
  color: string;
  width: number; // percentage of ring
  condition: () => boolean; // When to show
}
```

### **Aura Color Calculation**
```typescript
const calculateAuraColor = (userStats: UserStats): string => {
  const positivity = userStats.positiveReactions / userStats.totalReactions;
  
  if (positivity >= 0.8) return '#4ade80'; // Green - High positivity
  if (positivity >= 0.6) return '#60a5fa'; // Blue - Good positivity
  if (positivity >= 0.4) return '#fbbf24'; // Yellow - Neutral
  if (positivity >= 0.2) return '#f97316'; // Orange - Low positivity
  return '#ef4444'; // Red - Very low positivity
};
```

### **Micro-Bands**

#### **Writer Band**
```typescript
const writerBand: MicroBand = {
  type: 'writer',
  color: '#8b5cf6', // Purple
  width: 15, // 15% of ring
  condition: (user) => user.articleCount >= 5 // Posted ≥5 articles
};
```

#### **Supporter Band**
```typescript
const supporterBand: MicroBand = {
  type: 'supporter',
  color: '#f59e0b', // Gold
  width: 10, // 10% of ring
  condition: (user) => user.supporter === true // Paid supporter
};
```

### **AuraRing Component**
```typescript
interface AuraRingProps {
  user: UserProfile;
  size?: 'small' | 'medium' | 'large';
  showMicroBands?: boolean;
  animated?: boolean;
}

const AuraRing: SvelteComponent = {
  props: ['user', 'size', 'showMicroBands', 'animated'],
  template: `
    <div class="aura-ring" class:size-{size} class:animated={animated}>
      <svg class="ring-svg" viewBox="0 0 100 100">
        <!-- Base ring -->
        <circle cx="50" cy="50" r="45" 
                fill="none" 
                stroke={user.auraRing.baseColor} 
                stroke-width="8" />
        
        <!-- Micro-bands -->
        {#if showMicroBands}
          {#each user.auraRing.microBands as band}
            <circle cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={band.color} 
                    stroke-width="3"
                    stroke-dasharray="{band.width} {100-band.width}"
                    stroke-dashoffset="0" />
          {/each}
        {/if}
      </svg>
      
      <!-- User avatar in center -->
      <div class="avatar-center">
        <img src={user.avatar} alt={user.username} />
      </div>
    </div>
  `
};
```

---

## 📊 Personal ÆL Insights

### **Personal Analytics**
```typescript
interface PersonalAetherInsights {
  moodPatterns: {
    [mood: string]: number;
  };
  reactionTendencies: {
    [reaction: string]: number;
  };
  moonCorrelation: {
    phase: string;
    correlation: number;
  };
  charts: {
    mood30Day: ChartData;
    mood90Day: ChartData;
    reactions30Day: ChartData;
    reactions90Day: ChartData;
  };
}
```

### **ÆL Scope Settings**
```typescript
interface AetherScopeSettings {
  scope: 'Off' | 'Basic' | 'Advanced';
  exportData: boolean;
  eraseData: boolean;
  consentDate: Date;
}
```

### **Personal ÆL UI**
```typescript
interface PersonalAetherPageProps {
  insights: PersonalAetherInsights;
  scope: AetherScopeSettings;
  onScopeChange: (scope: string) => void;
  onExport: () => void;
  onErase: () => void;
}

const PersonalAetherPage: SvelteComponent = {
  props: ['insights', 'scope', 'onScopeChange', 'onExport', 'onErase'],
  template: `
    <div class="personal-aether-page">
      <h2>Personal ÆtherLens Insights</h2>
      
      <div class="scope-settings">
        <label>
          Data Collection Scope:
          <select bind:value={scope.scope} on:change={() => onScopeChange(scope.scope)}>
            <option value="Off">Off</option>
            <option value="Basic">Basic</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
      </div>
      
      {#if scope.scope !== 'Off'}
        <div class="insights-content">
          <div class="mood-patterns">
            <h3>Mood Patterns</h3>
            <!-- Mood charts -->
          </div>
          
          <div class="reaction-tendencies">
            <h3>Reaction Tendencies</h3>
            <!-- Reaction charts -->
          </div>
          
          <div class="moon-correlation">
            <h3>Moon Correlation</h3>
            <!-- Moon correlation display -->
          </div>
        </div>
      {/if}
      
      <div class="data-controls">
        <button on:click={onExport}>Export My Data</button>
        <button on:click={onErase} class="danger">Erase My Data</button>
      </div>
    </div>
  `
};
```

---

## ✍️ Writer Dashboard

### **Writer Dashboard Features**
```typescript
interface WriterDashboard {
  articles: ArticleComment[];
  filters: {
    articleType: string[];
    status: ('published' | 'unpublished')[];
    dateRange: { start: Date; end: Date };
  };
  stats: {
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    totalReactions: number;
  };
}
```

### **Article Management**
```typescript
interface ArticleComment {
  id: string;
  resourceId: string;
  resourceTitle: string;
  body: string;
  articleType: string;
  status: 'published' | 'unpublished';
  createdAt: Date;
  updatedAt: Date;
  views: number;
  reactions: ReactionCounts;
}

interface ReactionCounts {
  [reactionType: string]: {
    total: number;
    strength1: number;
    strength2: number;
  };
}
```

### **Writer Dashboard UI**
```typescript
interface WriterDashboardProps {
  dashboard: WriterDashboard;
  onPublish: (articleId: string) => void;
  onUnpublish: (articleId: string) => void;
  onFilter: (filters: WriterFilters) => void;
}

const WriterDashboard: SvelteComponent = {
  props: ['dashboard', 'onPublish', 'onUnpublish', 'onFilter'],
  template: `
    <div class="writer-dashboard">
      <h2>Writer Dashboard</h2>
      
      <div class="stats-overview">
        <div class="stat-card">
          <h3>{dashboard.stats.totalArticles}</h3>
          <p>Total Articles</p>
        </div>
        <div class="stat-card">
          <h3>{dashboard.stats.publishedArticles}</h3>
          <p>Published</p>
        </div>
        <div class="stat-card">
          <h3>{dashboard.stats.totalViews}</h3>
          <p>Total Views</p>
        </div>
        <div class="stat-card">
          <h3>{dashboard.stats.totalReactions}</h3>
          <p>Total Reactions</p>
        </div>
      </div>
      
      <div class="filters">
        <select bind:value={filters.articleType}>
          <option value="">All Types</option>
          <option value="opinion">Opinion</option>
          <option value="critique">Critique</option>
          <option value="science">Science</option>
          <option value="health">Health</option>
          <option value="comedy">Comedy</option>
          <option value="mystic">Mystic</option>
        </select>
        
        <select bind:value={filters.status}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>
      
      <div class="articles-list">
        {#each dashboard.articles as article}
          <div class="article-card">
            <h3>{article.resourceTitle}</h3>
            <p class="article-type">{article.articleType}</p>
            <p class="article-body">{article.body.substring(0, 200)}...</p>
            
            <div class="article-stats">
              <span>{article.views} views</span>
              <span>{article.reactions.total} reactions</span>
            </div>
            
            <div class="article-actions">
              {#if article.status === 'published'}
                <button on:click={() => onUnpublish(article.id)}>Unpublish</button>
              {:else}
                <button on:click={() => onPublish(article.id)}>Publish</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  `
};
```

---

## 🔒 Privacy Settings

### **Privacy Controls**
```typescript
interface PrivacySettings {
  showLocationText: boolean;
  showActivity: boolean;
  showMood: boolean;
  showAura: boolean;
  allowMentions: boolean;
  blockUsers: string[];
}
```

### **Privacy Settings UI**
```typescript
interface PrivacySettingsProps {
  settings: PrivacySettings;
  onUpdate: (settings: PrivacySettings) => void;
}

const PrivacySettings: SvelteComponent = {
  props: ['settings', 'onUpdate'],
  template: `
    <div class="privacy-settings">
      <h2>Privacy Settings</h2>
      
      <div class="privacy-toggles">
        <label>
          <input type="checkbox" bind:checked={settings.showLocationText}>
          Show location in profile
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.showActivity}>
          Show activity to others
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.showMood}>
          Show current mood
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.showAura}>
          Show aura ring
        </label>
        
        <label>
          <input type="checkbox" bind:checked={settings.allowMentions}>
          Allow @mentions
        </label>
      </div>
      
      <div class="blocked-users">
        <h3>Blocked Users</h3>
        <div class="blocked-list">
          {#each settings.blockUsers as userId}
            <div class="blocked-user">
              <span>{userId}</span>
              <button on:click={() => unblockUser(userId)}>Unblock</button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  `
};
```

---

## 🎨 Profile UI Components

### **Profile Header**
```typescript
interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

const ProfileHeader: SvelteComponent = {
  props: ['user', 'isOwnProfile', 'onFollow', 'onUnfollow'],
  template: `
    <div class="profile-header">
      <div class="profile-avatar">
        <AuraRing user={user} size="large" showMicroBands={true} animated={true} />
      </div>
      
      <div class="profile-info">
        <h1>{user.username}</h1>
        <p class="bio">{user.bio}</p>
        <p class="mood">Current mood: {user.mood_emoji}</p>
        
        {#if !isOwnProfile}
          <div class="follow-actions">
            <button on:click={onFollow}>Follow</button>
            <button on:click={onUnfollow}>Unfollow</button>
          </div>
        {/if}
      </div>
    </div>
  `
};
```

### **Profile Tabs Navigation**
```typescript
interface ProfileTabsProps {
  activeTab: string;
  tabs: ProfileTab[];
  onTabChange: (tabId: string) => void;
}

const ProfileTabs: SvelteComponent = {
  props: ['activeTab', 'tabs', 'onTabChange'],
  template: `
    <div class="profile-tabs">
      <nav class="tab-navigation">
        {#each tabs as tab}
          <button 
            class="tab-button" 
            class:active={activeTab === tab.id}
            on:click={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        {/each}
      </nav>
      
      <div class="tab-content">
        {#each tabs as tab}
          {#if activeTab === tab.id}
            {tab.content}
          {/if}
        {/each}
      </div>
    </div>
  `
};
```

---

## 🔧 API Endpoints

### **Profile Management**
```typescript
// GET /api/profiles/:username
interface ProfileResponse {
  user: UserProfile;
  isOwnProfile: boolean;
  isFollowing: boolean;
  stats: UserStats;
}

// PUT /api/profiles/:username
interface ProfileUpdateRequest {
  bio?: string;
  mood_emoji?: string;
  privacy_settings?: PrivacySettings;
}

// GET /api/profiles/:username/articles
interface ArticlesResponse {
  articles: ArticleComment[];
  total: number;
  page: number;
  limit: number;
}
```

### **Writer Dashboard**
```typescript
// GET /api/writer/dashboard
interface WriterDashboardResponse {
  dashboard: WriterDashboard;
  stats: WriterStats;
}

// POST /api/articles/:id/publish
// POST /api/articles/:id/unpublish
interface PublishResponse {
  success: boolean;
  article: ArticleComment;
}
```

### **Personal ÆL**
```typescript
// GET /api/me/ael/insights
interface PersonalAetherResponse {
  insights: PersonalAetherInsights;
  scope: AetherScopeSettings;
}

// PUT /api/me/ael/scope
interface ScopeUpdateRequest {
  scope: 'Off' | 'Basic' | 'Advanced';
}

// GET /api/me/ael/export
// DELETE /api/me/ael/data
```

---

## 🎯 Performance Requirements

### **Profile Loading**
- **<100ms**: Profile page load time
- **<50ms**: Profile data API responses
- **Caching**: Cache profile data for 5 minutes
- **Optimistic updates**: Update UI immediately on changes

### **AuraRing Rendering**
- **60fps**: AuraRing animations maintain 60fps
- **GPU acceleration**: Use CSS transforms for smooth animations
- **Responsive**: AuraRing scales properly on all devices
- **Accessibility**: Screen reader support for aura information

### **Writer Dashboard**
- **<200ms**: Dashboard load time
- **Pagination**: Efficient pagination for large article lists
- **Real-time updates**: Live updates for article stats
- **Search**: Fast search within user's articles

---

## 🧪 Testing Requirements

### **Profile Tests**
- **Profile rendering**: Test profile display and data
- **AuraRing calculation**: Test aura color and micro-band logic
- **Privacy settings**: Test privacy control functionality
- **Follow system**: Test follow/unfollow functionality

### **Writer Dashboard Tests**
- **Article management**: Test publish/unpublish functionality
- **Filtering**: Test article filtering and search
- **Stats calculation**: Test dashboard statistics
- **Permissions**: Test writer dashboard access

### **Personal ÆL Tests**
- **Data collection**: Test ÆL data collection based on scope
- **Privacy protection**: Test user data privacy
- **Export functionality**: Test data export features
- **Data erasure**: Test data deletion functionality

This profile system provides a rich, personalized experience that respects user privacy while offering meaningful insights and community recognition through the AuraRing system.
