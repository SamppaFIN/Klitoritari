-- Functions and triggers for Eldritch Sanctuary
-- This migration creates utility functions and automated triggers

-- Function to update base territory when points are added
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
        SELECT COALESCE(
            ST_Area(
                ST_ConvexHull(
                    ST_Collect(ST_Point(longitude, latitude))
                )
            ) * 1000000, 
            50.0
        )
        FROM territory_points 
        WHERE base_id = NEW.base_id
    )
    WHERE id = NEW.base_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for territory updates
CREATE TRIGGER trigger_update_base_territory
    AFTER INSERT OR UPDATE ON territory_points
    FOR EACH ROW EXECUTE FUNCTION update_base_territory();

-- Function to update player stats
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update player's healing contribution based on base count
    UPDATE players 
    SET healing_contribution = (
        SELECT COUNT(*) FROM player_bases 
        WHERE player_id = NEW.player_id AND is_active = true
    )
    WHERE id = NEW.player_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for player stats updates
CREATE TRIGGER trigger_update_player_stats
    AFTER INSERT OR UPDATE ON player_bases
    FOR EACH ROW EXECUTE FUNCTION update_player_stats();

-- Function to validate territory integrity
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

-- Function to get nearby bases
CREATE OR REPLACE FUNCTION get_nearby_bases(
    user_lat DECIMAL(10, 8),
    user_lng DECIMAL(11, 8),
    radius_meters INTEGER DEFAULT 1000
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_meters DECIMAL(8, 2),
    cosmic_energy INTEGER,
    base_level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pb.id,
        pb.name,
        pb.latitude,
        pb.longitude,
        ST_Distance(
            ST_Point(user_lng, user_lat)::geography,
            ST_Point(pb.longitude, pb.latitude)::geography
        ) as distance_meters,
        pb.cosmic_energy,
        pb.base_level
    FROM player_bases pb
    WHERE pb.is_active = true
    AND ST_DWithin(
        ST_Point(user_lng, user_lat)::geography,
        ST_Point(pb.longitude, pb.latitude)::geography,
        radius_meters
    )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate territory area
CREATE OR REPLACE FUNCTION calculate_territory_area(base_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    area_square_meters DECIMAL(10, 2);
BEGIN
    SELECT ST_Area(
        ST_ConvexHull(
            ST_Collect(ST_Point(longitude, latitude))
        )::geography
    ) INTO area_square_meters
    FROM territory_points 
    WHERE base_id = base_uuid;
    
    RETURN COALESCE(area_square_meters, 0);
END;
$$ LANGUAGE plpgsql;
