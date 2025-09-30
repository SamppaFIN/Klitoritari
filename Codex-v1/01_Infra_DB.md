# 🗄️ Infrastructure & Database
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-INFRA-DB  
**Status**: Canonical

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🏗️ Database Schema (MVP)

### **Core Tables**

#### **users** (Supabase auth)
Standard Supabase authentication table.

#### **profiles**
```sql
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    mood_emoji VARCHAR(10),
    settings JSONB DEFAULT '{}', -- immersion level, notifications preset, show_location_text
    supporter BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **resources**
```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('youtube', 'article', 'tweet', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **topics**
```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **comments**
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    kind VARCHAR(20) DEFAULT 'plain' CHECK (kind IN ('plain', 'article')),
    article_type VARCHAR(20) CHECK (article_type IN ('opinion', 'critique', 'science', 'health', 'comedy', 'mystic', 'other')),
    body TEXT NOT NULL,
    length_chars INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'soft_hidden')),
    moon_phase_snapshot VARCHAR(20),
    moon_apex_flag BOOLEAN DEFAULT false,
    mood_snapshot VARCHAR(10),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### **reactions**
```sql
CREATE TYPE reaction_type AS ENUM (
    'rose', 'diamond', 'owl', 'health', 'science', 'comedy', 
    'sheriff', 'confusing', 'dislike', 'troll', 'coffin'
);

CREATE TABLE reactions (
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type NOT NULL,
    strength SMALLINT CHECK (strength IN (1, 2)) DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id, type)
);
```

#### **resource_reactions**
```sql
CREATE TABLE resource_reactions (
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type NOT NULL,
    strength SMALLINT CHECK (strength IN (1, 2)) DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (resource_id, user_id, type)
);
```

#### **flags**
```sql
CREATE TYPE flag_reason AS ENUM (
    'spam', 'harassment', 'hate_speech', 'misinformation', 'inappropriate', 'other'
);

CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason flag_reason NOT NULL,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'dismissed', 'severe')),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE
);
```

#### **audit_logs**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    subject_id UUID NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **security_events**
```sql
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_hash VARCHAR(64), -- hashed IP address
    raw_ip INET, -- only for severe cases
    ua_family VARCHAR(100),
    meta JSONB DEFAULT '{}',
    case_id UUID -- only for severe cases
);
```

#### **follows**
```sql
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, followee_id)
);
```

#### **activity**
```sql
CREATE TYPE activity_kind AS ENUM ('mention', 'reply', 'follow', 'mod');

CREATE TABLE activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- recipient
    kind activity_kind NOT NULL,
    subject_type VARCHAR(50) NOT NULL,
    subject_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seen_at TIMESTAMP WITH TIME ZONE
);
```

#### **mentions**
```sql
CREATE TABLE mentions (
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    mentioned_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (comment_id, mentioned_user_id)
);
```

#### **platform_stats_daily**
```sql
CREATE TABLE platform_stats_daily (
    date DATE NOT NULL,
    route VARCHAR(100) NOT NULL,
    views INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    reactions_count INTEGER DEFAULT 0,
    PRIMARY KEY (date, route)
);
```

#### **aether_opt_in**
```sql
CREATE TYPE aether_scope AS ENUM ('Off', 'Basic', 'Advanced');

CREATE TABLE aether_opt_in (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    scope aether_scope NOT NULL DEFAULT 'Off',
    consented_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **aether_geo**
```sql
CREATE TABLE aether_geo (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    country_iso2 VARCHAR(2) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    verified BOOLEAN DEFAULT false
);
```

#### **aether_daily**
```sql
CREATE TABLE aether_daily (
    date DATE NOT NULL,
    country_iso2 VARCHAR(2) NOT NULL,
    moods_json JSONB DEFAULT '{}',
    reactions_json JSONB DEFAULT '{}',
    users_active INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    reactions INTEGER DEFAULT 0,
    bots_excluded BOOLEAN DEFAULT true,
    PRIMARY KEY (date, country_iso2)
);
```

## 🔧 Indexes for Performance

```sql
-- Core indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_resources_url ON resources(url);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_comments_resource_created ON comments(resource_id, created_at);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_reactions_comment ON reactions(comment_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(type);
CREATE INDEX idx_resource_reactions_resource ON resource_reactions(resource_id);
CREATE INDEX idx_flags_comment ON flags(comment_id);
CREATE INDEX idx_flags_status ON flags(status);
CREATE INDEX idx_activity_user ON activity(user_id, created_at);
CREATE INDEX idx_platform_stats_date ON platform_stats_daily(date, route);
CREATE INDEX idx_aether_daily_date ON aether_daily(date, country_iso2);
CREATE INDEX idx_mentions_user ON mentions(mentioned_user_id);
```

## 🔒 Row Level Security (RLS)

### **Comments RLS**
```sql
-- Public read, owner/admin write
CREATE POLICY "Comments public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Comments owner write" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comments owner update" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Comments admin bypass" ON comments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND supporter = true)
);
```

### **Reactions RLS**
```sql
-- Public read, owner write
CREATE POLICY "Reactions public read" ON reactions FOR SELECT USING (true);
CREATE POLICY "Reactions owner write" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reactions owner delete" ON reactions FOR DELETE USING (auth.uid() = user_id);
```

### **Flags RLS**
```sql
-- Logged-in users can create, own + admin can read
CREATE POLICY "Flags logged in create" ON flags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Flags own read" ON flags FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Flags admin read" ON flags FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND supporter = true)
);
```

### **Aether Tables RLS**
```sql
-- Public read for daily stats, owner read/write for personal data
CREATE POLICY "Aether daily public read" ON aether_daily FOR SELECT USING (true);
CREATE POLICY "Aether opt-in owner" ON aether_opt_in FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Aether geo owner" ON aether_geo FOR ALL USING (auth.uid() = user_id);
```

## 🔐 Security & Privacy Policies

### **Data Retention**
- **security_events**: 90d hashed; 180d for severe (raw_ip), then purge
- **analytics raw**: 14d temp
- **Comments**: Never auto-delete in MVP (can add expiry tiers later)

### **IP Address Handling**
- **Hashed IP**: All security events use hashed IP addresses
- **Raw IP**: Only stored for severe cases with case_id, audited access
- **Retention**: 90d hashed, 180d raw IP for severe cases

### **K-Anonymity**
- **Public aggregates**: k-anonymity k ≥ 50 per country/day
- **Under-k countries**: Bucketed as "Other"
- **Personal data**: Explicit opt-in required

## 🚀 Migration Strategy

### **Phase 1: Core Tables**
1. Create users, profiles, resources, topics
2. Create comments, reactions, resource_reactions
3. Set up basic RLS policies

### **Phase 2: Moderation**
1. Create flags, audit_logs, security_events
2. Set up moderation RLS policies
3. Create security event logging

### **Phase 3: Social Features**
1. Create follows, activity, mentions
2. Set up social RLS policies
3. Create activity feed system

### **Phase 4: Analytics**
1. Create platform_stats_daily, aether_* tables
2. Set up analytics RLS policies
3. Create k-anonymity functions

## 📊 Performance Considerations

### **Query Optimization**
- **Comment pagination**: Use cursor-based pagination with `(created_at, id)`
- **Reaction counts**: Use materialized views for aggregation
- **Search**: Use GIN indexes for JSONB fields
- **Activity feeds**: Use composite indexes for user + created_at

### **Scaling Strategy**
- **Read replicas**: For analytics and reporting
- **Partitioning**: By date for platform_stats_daily
- **Caching**: Redis for frequently accessed data
- **CDN**: For static assets and media

## 🔧 Database Functions

### **Moon Phase Snapshot**
```sql
CREATE OR REPLACE FUNCTION get_moon_phase_snapshot()
RETURNS VARCHAR(20) AS $$
-- Meeus-based lunar phase calculation
-- Returns: 'new', 'first_quarter', 'full', 'last_quarter'
$$ LANGUAGE plpgsql;
```

### **Platform Stats Increment**
```sql
CREATE OR REPLACE FUNCTION increment_platform_stats(route_name VARCHAR(100), kind VARCHAR(50))
RETURNS VOID AS $$
-- Increment daily platform statistics
$$ LANGUAGE plpgsql;
```

### **K-Anonymity Check**
```sql
CREATE OR REPLACE FUNCTION check_k_anonymity(country_iso2 VARCHAR(2), date_val DATE)
RETURNS BOOLEAN AS $$
-- Check if country/day combination meets k-anonymity threshold
$$ LANGUAGE plpgsql;
```

## 🎯 Database Schema Validation

### **Constraints**
- **Foreign keys**: All references properly constrained
- **Check constraints**: Enum values validated
- **Unique constraints**: Usernames, URLs, composite keys
- **Not null**: Required fields properly marked

### **Data Integrity**
- **Cascade deletes**: Proper cleanup on user/content deletion
- **Soft deletes**: Comments use deleted_at instead of hard delete
- **Audit trails**: All significant actions logged
- **Consistency**: Referential integrity maintained

This database schema provides the foundation for a scalable, secure, and privacy-conscious discussion platform that serves truth and community healing.
