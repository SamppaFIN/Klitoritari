---
brdc:
  id: AASF-DOC-700
  title: Database Schema - Eldritch Sanctuary
  owner: "\U0001F338 Aurora"
  status: canonical
  version: 1.0.0
  last_updated: '2025-10-01'
  self: docs\database-schema.md
  tags:
  - brdc
  - consciousness
  - healing
  related: []
  dependencies: []
  consciousness_level: high
  healing_impact: Directly serves spatial wisdom and community healing
  sacred_principles:
  - consciousness-first
  - community-healing
  - spatial-wisdom
---

# Database Schema - Eldritch Sanctuary

## Overview
This document defines the database schema for the Eldritch Sanctuary cosmic map exploration platform, focusing on player bases, territory management, and community features.

## Core Tables

### 1. Players
```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    lumen_tokens INTEGER DEFAULT 0,
    wisdom_level INTEGER DEFAULT 1,
    healing_contribution INTEGER DEFAULT 0
);
```

### 2. Player Bases
```sql
CREATE TABLE player_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(8, 2),
    established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    base_level INTEGER DEFAULT 1,
    territory_radius DECIMAL(8, 2) DEFAULT 50.0, -- meters
    cosmic_energy INTEGER DEFAULT 100,
    community_connections INTEGER DEFAULT 0,
    sacred_structures JSONB DEFAULT '[]'::jsonb,
    base_settings JSONB DEFAULT '{}'::jsonb
);
```

### 3. Territory Points
```sql
CREATE TABLE territory_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_id UUID NOT NULL REFERENCES player_bases(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(8, 2),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_type VARCHAR(20) DEFAULT 'walk', -- walk, drive, stationary
    energy_contribution INTEGER DEFAULT 1,
    is_boundary BOOLEAN DEFAULT false,
    sequence_order INTEGER NOT NULL
);
```

### 4. Base Connections
```sql
CREATE TABLE base_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_a_id UUID NOT NULL REFERENCES player_bases(id) ON DELETE CASCADE,
    base_b_id UUID NOT NULL REFERENCES player_bases(id) ON DELETE CASCADE,
    connection_type VARCHAR(20) DEFAULT 'neighbor', -- neighbor, ally, trade, sacred
    established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    strength INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    connection_data JSONB DEFAULT '{}'::jsonb,
    UNIQUE(base_a_id, base_b_id)
);
```

### 5. Sacred Structures
```sql
CREATE TABLE sacred_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_id UUID NOT NULL REFERENCES player_bases(id) ON DELETE CASCADE,
    structure_type VARCHAR(30) NOT NULL, -- altar, shrine, beacon, sanctuary
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    energy_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_enhanced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    structure_data JSONB DEFAULT '{}'::jsonb
);
```

### 6. Base Activities
```sql
CREATE TABLE base_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_id UUID NOT NULL REFERENCES player_bases(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    activity_type VARCHAR(30) NOT NULL, -- visit, expand, build, connect, meditate
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    energy_contribution INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activity_data JSONB DEFAULT '{}'::jsonb
);
```

## Indexes for Performance

```sql
-- Player bases spatial index
CREATE INDEX idx_player_bases_location ON player_bases USING GIST (
    ST_Point(longitude, latitude)
);

-- Territory points spatial index
CREATE INDEX idx_territory_points_location ON territory_points USING GIST (
    ST_Point(longitude, latitude)
);

-- Territory points by base
CREATE INDEX idx_territory_points_base_id ON territory_points(base_id);

-- Base connections
CREATE INDEX idx_base_connections_base_a ON base_connections(base_a_id);
CREATE INDEX idx_base_connections_base_b ON base_connections(base_b_id);

-- Base activities
CREATE INDEX idx_base_activities_base_id ON base_activities(base_id);
CREATE INDEX idx_base_activities_player_id ON base_activities(player_id);
CREATE INDEX idx_base_activities_created_at ON base_activities(created_at);

-- Sacred structures spatial index
CREATE INDEX idx_sacred_structures_location ON sacred_structures USING GIST (
    ST_Point(longitude, latitude)
);
```

## Row Level Security (RLS) Policies

### Players Table
```sql
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Players can view all active players
CREATE POLICY "Players can view active players" ON players
    FOR SELECT USING (is_active = true);

-- Players can only update their own data
CREATE POLICY "Players can update own data" ON players
    FOR UPDATE USING (auth.uid() = id);
```

### Player Bases Table
```sql
ALTER TABLE player_bases ENABLE ROW LEVEL SECURITY;

-- Anyone can view active bases
CREATE POLICY "Anyone can view active bases" ON player_bases
    FOR SELECT USING (is_active = true);

-- Players can only manage their own bases
CREATE POLICY "Players can manage own bases" ON player_bases
    FOR ALL USING (auth.uid() = player_id);
```

### Territory Points Table
```sql
ALTER TABLE territory_points ENABLE ROW LEVEL SECURITY;

-- Anyone can view territory points for active bases
CREATE POLICY "Anyone can view territory points" ON territory_points
    FOR SELECT USING (
        base_id IN (
            SELECT id FROM player_bases WHERE is_active = true
        )
    );

-- Players can only manage territory for their own bases
CREATE POLICY "Players can manage own territory" ON territory_points
    FOR ALL USING (
        base_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        )
    );
```

## Functions and Triggers

### Update Base Territory
```sql
CREATE OR REPLACE FUNCTION update_base_territory()
RETURNS TRIGGER AS $$
BEGIN
    -- Update base last activity
    UPDATE player_bases 
    SET last_activity = NOW()
    WHERE id = NEW.base_id;
    
    -- Recalculate territory radius based on points
    UPDATE player_bases 
    SET territory_radius = (
        SELECT COALESCE(ST_Area(ST_ConvexHull(ST_Collect(ST_Point(longitude, latitude)))) * 1000000, 50.0)
        FROM territory_points 
        WHERE base_id = NEW.base_id
    )
    WHERE id = NEW.base_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_base_territory
    AFTER INSERT OR UPDATE ON territory_points
    FOR EACH ROW EXECUTE FUNCTION update_base_territory();
```

### Update Player Stats
```sql
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update player's base count
    UPDATE players 
    SET healing_contribution = (
        SELECT COUNT(*) FROM player_bases 
        WHERE player_id = NEW.player_id AND is_active = true
    )
    WHERE id = NEW.player_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_player_stats
    AFTER INSERT OR UPDATE ON player_bases
    FOR EACH ROW EXECUTE FUNCTION update_player_stats();
```

## Sacred Principles Integration

### Community Healing Metrics
```sql
-- View for community healing contribution
CREATE VIEW community_healing_metrics AS
SELECT 
    p.id,
    p.display_name,
    p.wisdom_level,
    COUNT(pb.id) as base_count,
    SUM(pb.territory_radius) as total_territory,
    SUM(pb.cosmic_energy) as total_energy,
    COUNT(bc.id) as connections_made,
    p.healing_contribution
FROM players p
LEFT JOIN player_bases pb ON p.id = pb.player_id AND pb.is_active = true
LEFT JOIN base_connections bc ON pb.id = bc.base_a_id AND bc.is_active = true
WHERE p.is_active = true
GROUP BY p.id, p.display_name, p.wisdom_level, p.healing_contribution
ORDER BY healing_contribution DESC, total_energy DESC;
```

### Wisdom Sharing Analytics
```sql
-- View for wisdom sharing through base activities
CREATE VIEW wisdom_sharing_analytics AS
SELECT 
    ba.activity_type,
    COUNT(*) as activity_count,
    SUM(ba.energy_contribution) as total_energy_shared,
    AVG(ba.energy_contribution) as avg_energy_per_activity,
    DATE_TRUNC('day', ba.created_at) as activity_date
FROM base_activities ba
JOIN player_bases pb ON ba.base_id = pb.id
WHERE pb.is_active = true
GROUP BY ba.activity_type, DATE_TRUNC('day', ba.created_at)
ORDER BY activity_date DESC, total_energy_shared DESC;
```

## Data Validation

### Check Territory Integrity
```sql
CREATE OR REPLACE FUNCTION validate_territory_integrity(base_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    point_count INTEGER;
    base_exists BOOLEAN;
BEGIN
    -- Check if base exists
    SELECT EXISTS(SELECT 1 FROM player_bases WHERE id = base_uuid AND is_active = true) INTO base_exists;
    
    IF NOT base_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check minimum territory points (at least 3 for a valid polygon)
    SELECT COUNT(*) INTO point_count 
    FROM territory_points 
    WHERE base_id = base_uuid;
    
    RETURN point_count >= 3;
END;
$$ LANGUAGE plpgsql;
```

## Migration Scripts

### Initial Migration
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create all tables
-- (Include all CREATE TABLE statements from above)

-- Create all indexes
-- (Include all CREATE INDEX statements from above)

-- Enable RLS and create policies
-- (Include all RLS policies from above)

-- Create functions and triggers
-- (Include all functions and triggers from above)

-- Create views
-- (Include all views from above)
```

This schema supports the sacred principles of community healing, wisdom sharing, and transparent governance while providing efficient spatial queries for the cosmic map exploration platform.
