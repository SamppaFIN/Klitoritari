-- Row Level Security (RLS) policies for Eldritch Sanctuary
-- This migration enables RLS and creates security policies

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacred_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_activities ENABLE ROW LEVEL SECURITY;

-- Players table policies
CREATE POLICY "Players can view active players" ON players
    FOR SELECT USING (is_active = true);

CREATE POLICY "Players can update own data" ON players
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Players can insert own data" ON players
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Player bases table policies
CREATE POLICY "Anyone can view active bases" ON player_bases
    FOR SELECT USING (is_active = true);

CREATE POLICY "Players can manage own bases" ON player_bases
    FOR ALL USING (auth.uid() = player_id);

-- Territory points table policies
CREATE POLICY "Anyone can view territory points" ON territory_points
    FOR SELECT USING (
        base_id IN (
            SELECT id FROM player_bases WHERE is_active = true
        )
    );

CREATE POLICY "Players can manage own territory" ON territory_points
    FOR ALL USING (
        base_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        )
    );

-- Base connections table policies
CREATE POLICY "Anyone can view active connections" ON base_connections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Players can manage own connections" ON base_connections
    FOR ALL USING (
        base_a_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        ) OR base_b_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        )
    );

-- Sacred structures table policies
CREATE POLICY "Anyone can view active structures" ON sacred_structures
    FOR SELECT USING (is_active = true);

CREATE POLICY "Players can manage own structures" ON sacred_structures
    FOR ALL USING (
        base_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        )
    );

-- Base activities table policies
CREATE POLICY "Anyone can view activities" ON base_activities
    FOR SELECT USING (true);

CREATE POLICY "Players can insert activities" ON base_activities
    FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can update own activities" ON base_activities
    FOR UPDATE USING (auth.uid() = player_id);
