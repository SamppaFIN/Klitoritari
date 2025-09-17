-- Initial database schema for Eldritch Sanctuary
-- This migration creates the core tables for player bases and territory management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create players table
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

-- Create player_bases table
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

-- Create territory_points table
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

-- Create base_connections table
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

-- Create sacred_structures table
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

-- Create base_activities table
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

-- Create spatial indexes
CREATE INDEX idx_player_bases_location ON player_bases USING GIST (
    ST_Point(longitude, latitude)
);

CREATE INDEX idx_territory_points_location ON territory_points USING GIST (
    ST_Point(longitude, latitude)
);

CREATE INDEX idx_sacred_structures_location ON sacred_structures USING GIST (
    ST_Point(longitude, latitude)
);

-- Create other performance indexes
CREATE INDEX idx_territory_points_base_id ON territory_points(base_id);
CREATE INDEX idx_base_connections_base_a ON base_connections(base_a_id);
CREATE INDEX idx_base_connections_base_b ON base_connections(base_b_id);
CREATE INDEX idx_base_activities_base_id ON base_activities(base_id);
CREATE INDEX idx_base_activities_player_id ON base_activities(player_id);
CREATE INDEX idx_base_activities_created_at ON base_activities(created_at);
