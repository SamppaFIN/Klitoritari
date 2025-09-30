# 📰 Feeds & Filters
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-FEEDS-FILTERS  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🎯 Curated Feeds

### **Feed Types**
```typescript
interface CuratedFeed {
  type: 'top_roses' | 'top_diamonds' | 'most_buried' | 'top_articles';
  window: 'day' | 'week' | 'month';
  limit: number;
  data: FeedItem[];
}

interface FeedItem {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceUrl: string;
  commentCount: number;
  reactionCounts: ReactionCounts;
  topComment: Comment;
  createdAt: Date;
}
```

### **Top Roses Feed**
```typescript
// GET /api/feeds/top_roses?window=week&limit=20
const getTopRosesFeed = async (window: string, limit: number): Promise<CuratedFeed> => {
  const query = `
    SELECT r.*, 
           COUNT(c.id) as comment_count,
           SUM(CASE WHEN re.type = 'rose' THEN re.strength ELSE 0 END) as rose_count
    FROM resources r
    LEFT JOIN comments c ON r.id = c.resource_id
    LEFT JOIN reactions re ON c.id = re.comment_id
    WHERE r.created_at >= NOW() - INTERVAL '${window}'
    GROUP BY r.id
    ORDER BY rose_count DESC
    LIMIT ${limit}
  `;
  
  return await executeQuery(query);
};
```

### **Top Diamonds Feed**
```typescript
// GET /api/feeds/top_diamonds?window=week&limit=20
const getTopDiamondsFeed = async (window: string, limit: number): Promise<CuratedFeed> => {
  const query = `
    SELECT r.*, 
           COUNT(c.id) as comment_count,
           SUM(CASE WHEN re.type = 'diamond' THEN re.strength ELSE 0 END) as diamond_count
    FROM resources r
    LEFT JOIN comments c ON r.id = c.resource_id
    LEFT JOIN reactions re ON c.id = re.comment_id
    WHERE r.created_at >= NOW() - INTERVAL '${window}'
    GROUP BY r.id
    ORDER BY diamond_count DESC
    LIMIT ${limit}
  `;
  
  return await executeQuery(query);
};
```

### **Most Buried Feed**
```typescript
// GET /api/feeds/most_buried?window=week&limit=20
const getMostBuriedFeed = async (window: string, limit: number): Promise<CuratedFeed> => {
  const query = `
    SELECT r.*, 
           COUNT(c.id) as comment_count,
           SUM(CASE WHEN re.type = 'coffin' THEN re.strength ELSE 0 END) as coffin_count
    FROM resources r
    LEFT JOIN comments c ON r.id = c.resource_id
    LEFT JOIN reactions re ON c.id = re.comment_id
    WHERE r.created_at >= NOW() - INTERVAL '${window}'
    GROUP BY r.id
    ORDER BY coffin_count DESC
    LIMIT ${limit}
  `;
  
  return await executeQuery(query);
};
```

### **Top Articles Feed**
```typescript
// GET /api/feeds/top_articles?article_type=opinion&window=week&limit=20
const getTopArticlesFeed = async (
  articleType: string, 
  window: string, 
  limit: number
): Promise<CuratedFeed> => {
  const query = `
    SELECT r.*, 
           COUNT(c.id) as comment_count,
           AVG(c.length_chars) as avg_length
    FROM resources r
    LEFT JOIN comments c ON r.id = c.resource_id AND c.kind = 'article'
    WHERE r.created_at >= NOW() - INTERVAL '${window}'
      AND c.article_type = '${articleType}'
    GROUP BY r.id
    ORDER BY comment_count DESC, avg_length DESC
    LIMIT ${limit}
  `;
  
  return await executeQuery(query);
};
```

---

## 🔍 Filtering MVP

### **Filter Parameters**
```typescript
interface FilterParams {
  q?: string; // Search query
  reactions?: ReactionType[]; // Filter by reaction types
  moods?: string[]; // Filter by mood snapshots
  time_window?: 'day' | 'week' | 'month' | 'year';
  min_len?: number; // Minimum comment length
  max_len?: number; // Maximum comment length
  article_type?: string; // Filter by article type
  resource_type?: string; // Filter by resource type
}
```

### **Search Endpoint**
```typescript
// GET /api/search?q=query&reactions[]=rose&moods[]=happy&time_window=week
interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  filters: FilterParams;
}

interface SearchResult {
  id: string;
  type: 'comment' | 'resource';
  content: string;
  author: string;
  createdAt: Date;
  reactions: ReactionCounts;
  mood: string;
  moonPhase: string;
  relevanceScore: number;
}
```

### **Search Implementation**
```typescript
const performSearch = async (params: FilterParams): Promise<SearchResponse> => {
  let query = `
    SELECT c.*, r.title as resource_title, r.url as resource_url,
           p.username, p.mood_emoji,
           COUNT(re.id) as reaction_count,
           ts_rank(to_tsvector('english', c.body), plainto_tsquery('english', $1)) as rank
    FROM comments c
    JOIN resources r ON c.resource_id = r.id
    JOIN profiles p ON c.user_id = p.user_id
    LEFT JOIN reactions re ON c.id = re.comment_id
    WHERE 1=1
  `;
  
  const queryParams = [params.q || ''];
  let paramIndex = 2;
  
  // Add filters
  if (params.q) {
    query += ` AND to_tsvector('english', c.body) @@ plainto_tsquery('english', $1)`;
  }
  
  if (params.reactions && params.reactions.length > 0) {
    query += ` AND EXISTS (
      SELECT 1 FROM reactions re2 
      WHERE re2.comment_id = c.id 
      AND re2.type = ANY($${paramIndex})
    )`;
    queryParams.push(params.reactions);
    paramIndex++;
  }
  
  if (params.moods && params.moods.length > 0) {
    query += ` AND c.mood_snapshot = ANY($${paramIndex})`;
    queryParams.push(params.moods);
    paramIndex++;
  }
  
  if (params.time_window) {
    query += ` AND c.created_at >= NOW() - INTERVAL '1 ${params.time_window}'`;
  }
  
  if (params.min_len) {
    query += ` AND c.length_chars >= $${paramIndex}`;
    queryParams.push(params.min_len);
    paramIndex++;
  }
  
  if (params.max_len) {
    query += ` AND c.length_chars <= $${paramIndex}`;
    queryParams.push(params.max_len);
    paramIndex++;
  }
  
  if (params.article_type) {
    query += ` AND c.article_type = $${paramIndex}`;
    queryParams.push(params.article_type);
    paramIndex++;
  }
  
  if (params.resource_type) {
    query += ` AND r.type = $${paramIndex}`;
    queryParams.push(params.resource_type);
    paramIndex++;
  }
  
  query += `
    GROUP BY c.id, r.title, r.url, p.username, p.mood_emoji
    ORDER BY rank DESC, c.created_at DESC
    LIMIT 50
  `;
  
  return await executeQuery(query, queryParams);
};
```

---

## 🎨 Feed UI Components

### **Feed Container**
```typescript
interface FeedContainerProps {
  feedType: string;
  window: string;
  limit: number;
  onLoadMore: () => void;
  onFilterChange: (filters: FilterParams) => void;
}

const FeedContainer: SvelteComponent = {
  props: ['feedType', 'window', 'limit', 'onLoadMore', 'onFilterChange'],
  template: `
    <div class="feed-container">
      <div class="feed-header">
        <h2>{feedType.replace('_', ' ').toUpperCase()}</h2>
        <div class="feed-controls">
          <select bind:value={window} on:change={() => onFilterChange({window})}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <div class="feed-items">
        {#each feedItems as item}
          <FeedItem {item} />
        {/each}
      </div>
      
      <div class="feed-footer">
        <button on:click={onLoadMore}>Load More</button>
      </div>
    </div>
  `
};
```

### **Feed Item**
```typescript
interface FeedItemProps {
  item: FeedItem;
  onReaction: (reaction: ReactionType) => void;
  onComment: () => void;
}

const FeedItem: SvelteComponent = {
  props: ['item', 'onReaction', 'onComment'],
  template: `
    <div class="feed-item">
      <div class="item-header">
        <h3><a href={item.resourceUrl} target="_blank">{item.resourceTitle}</a></h3>
        <span class="item-meta">
          {item.commentCount} comments • {item.createdAt.toLocaleDateString()}
        </span>
      </div>
      
      <div class="item-content">
        <p>{item.topComment.body}</p>
        <div class="item-reactions">
          <ReactionRibbon 
            countsByType={item.reactionCounts}
            onToggle={onReaction}
          />
        </div>
      </div>
      
      <div class="item-actions">
        <button on:click={onComment}>Comment</button>
        <button on:click={() => window.open(item.resourceUrl)}>View Resource</button>
      </div>
    </div>
  `
};
```

### **Search Interface**
```typescript
interface SearchInterfaceProps {
  onSearch: (params: FilterParams) => void;
  onFilterChange: (filters: FilterParams) => void;
}

const SearchInterface: SvelteComponent = {
  props: ['onSearch', 'onFilterChange'],
  template: `
    <div class="search-interface">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search comments and resources..."
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && onSearch({q: searchQuery})}
        />
        <button on:click={() => onSearch({q: searchQuery})}>Search</button>
      </div>
      
      <div class="search-filters">
        <div class="filter-group">
          <label>Reactions:</label>
          <select multiple bind:value={selectedReactions}>
            <option value="rose">Rose</option>
            <option value="diamond">Diamond</option>
            <option value="owl">Owl</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="comedy">Comedy</option>
            <option value="sheriff">Sheriff</option>
            <option value="confusing">Confusing</option>
            <option value="dislike">Dislike</option>
            <option value="troll">Troll</option>
            <option value="coffin">Coffin</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Time Window:</label>
          <select bind:value={timeWindow}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Article Type:</label>
          <select bind:value={articleType}>
            <option value="">All Types</option>
            <option value="opinion">Opinion</option>
            <option value="critique">Critique</option>
            <option value="science">Science</option>
            <option value="health">Health</option>
            <option value="comedy">Comedy</option>
            <option value="mystic">Mystic</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Length:</label>
          <input type="number" placeholder="Min" bind:value={minLength} />
          <input type="number" placeholder="Max" bind:value={maxLength} />
        </div>
      </div>
    </div>
  `
};
```

---

## 📊 Search vs Expansion Plans

### **Current MVP Search**
- **Full-text search**: PostgreSQL full-text search
- **Basic filters**: Reactions, moods, time, length, type
- **Simple ranking**: Relevance + recency
- **50 results limit**: Performance constraint

### **Phase D Expansion Plans**
- **Advanced search**: Elasticsearch integration
- **Semantic search**: AI-powered content understanding
- **Personalized ranking**: User preference learning
- **Infinite scroll**: Remove pagination limits
- **Search suggestions**: Auto-complete and suggestions
- **Search analytics**: Search behavior tracking

### **Search Performance**
```typescript
// Current performance targets
const searchPerformanceTargets = {
  responseTime: '<100ms', // p95 response time
  resultAccuracy: '>90%', // Relevant results
  indexSize: '<1GB', // Search index size
  updateFrequency: '5min' // Index update frequency
};
```

---

## 🔧 API Endpoints

### **Feed Endpoints**
```typescript
// GET /api/feeds/top_roses?window=week&limit=20
// GET /api/feeds/top_diamonds?window=week&limit=20
// GET /api/feeds/most_buried?window=week&limit=20
// GET /api/feeds/top_articles?article_type=opinion&window=week&limit=20

interface FeedResponse {
  feed: CuratedFeed;
  total: number;
  page: number;
  limit: number;
  window: string;
}
```

### **Search Endpoints**
```typescript
// GET /api/search?q=query&reactions[]=rose&moods[]=happy&time_window=week&min_len=100&max_len=1000&article_type=opinion&resource_type=youtube

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  filters: FilterParams;
  searchTime: number; // ms
}
```

### **Filter Endpoints**
```typescript
// GET /api/filters/reactions
// GET /api/filters/moods
// GET /api/filters/article_types
// GET /api/filters/resource_types

interface FilterOptionsResponse {
  reactions: ReactionType[];
  moods: string[];
  articleTypes: string[];
  resourceTypes: string[];
}
```

---

## 🎯 Performance Requirements

### **Feed Performance**
- **<50ms**: Feed API responses under 50ms
- **Caching**: Cache feeds for 5 minutes
- **Pagination**: Efficient cursor-based pagination
- **Real-time**: Live updates for reaction counts

### **Search Performance**
- **<100ms**: Search API responses under 100ms
- **Index optimization**: Optimized PostgreSQL indexes
- **Query optimization**: EXPLAIN shows index usage
- **Debouncing**: Client-side search debouncing

### **Filter Performance**
- **<25ms**: Filter API responses under 25ms
- **Precomputed**: Precomputed filter options
- **Caching**: Cache filter results
- **Empty states**: Clear empty state handling

---

## 🧪 Testing Requirements

### **Feed Tests**
- **Feed generation**: Test curated feed creation
- **Filtering**: Test feed filtering functionality
- **Pagination**: Test feed pagination
- **Performance**: Test feed performance requirements

### **Search Tests**
- **Search accuracy**: Test search result relevance
- **Filter combinations**: Test multiple filter combinations
- **Performance**: Test search performance requirements
- **Edge cases**: Test empty queries, special characters

### **Integration Tests**
- **End-to-end search**: Test complete search flow
- **Feed updates**: Test real-time feed updates
- **Filter persistence**: Test filter state persistence
- **Mobile responsiveness**: Test mobile search interface

This feed and filter system provides powerful content discovery while maintaining performance and user experience standards.
