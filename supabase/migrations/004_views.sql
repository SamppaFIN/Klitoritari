-- Views for Eldritch Sanctuary analytics and reporting
-- This migration creates views for community healing metrics and wisdom sharing

-- Community healing metrics view
CREATE VIEW community_healing_metrics AS
SELECT 
    p.id,
    p.display_name,
    p.wisdom_level,
    COUNT(pb.id) as base_count,
    SUM(pb.territory_radius) as total_territory,
    SUM(pb.cosmic_energy) as total_energy,
    COUNT(bc.id) as connections_made,
    p.healing_contribution,
    p.lumen_tokens
FROM players p
LEFT JOIN player_bases pb ON p.id = pb.player_id AND pb.is_active = true
LEFT JOIN base_connections bc ON pb.id = bc.base_a_id AND bc.is_active = true
WHERE p.is_active = true
GROUP BY p.id, p.display_name, p.wisdom_level, p.healing_contribution, p.lumen_tokens
ORDER BY healing_contribution DESC, total_energy DESC;

-- Wisdom sharing analytics view
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

-- Base territory overview view
CREATE VIEW base_territory_overview AS
SELECT 
    pb.id as base_id,
    pb.name as base_name,
    pb.latitude,
    pb.longitude,
    pb.territory_radius,
    pb.cosmic_energy,
    pb.base_level,
    COUNT(tp.id) as territory_point_count,
    calculate_territory_area(pb.id) as territory_area_sqm,
    p.display_name as owner_name,
    p.wisdom_level as owner_wisdom_level
FROM player_bases pb
JOIN players p ON pb.player_id = p.id
LEFT JOIN territory_points tp ON pb.id = tp.base_id
WHERE pb.is_active = true AND p.is_active = true
GROUP BY pb.id, pb.name, pb.latitude, pb.longitude, pb.territory_radius, 
         pb.cosmic_energy, pb.base_level, p.display_name, p.wisdom_level
ORDER BY pb.cosmic_energy DESC;

-- Sacred structures summary view
CREATE VIEW sacred_structures_summary AS
SELECT 
    ss.structure_type,
    COUNT(*) as structure_count,
    AVG(ss.energy_level) as avg_energy_level,
    SUM(ss.energy_level) as total_energy,
    pb.name as base_name,
    p.display_name as owner_name
FROM sacred_structures ss
JOIN player_bases pb ON ss.base_id = pb.id
JOIN players p ON pb.player_id = p.id
WHERE ss.is_active = true AND pb.is_active = true AND p.is_active = true
GROUP BY ss.structure_type, pb.name, p.display_name
ORDER BY total_energy DESC;

-- Recent base activities view
CREATE VIEW recent_base_activities AS
SELECT 
    ba.id,
    ba.activity_type,
    ba.description,
    ba.energy_contribution,
    ba.created_at,
    pb.name as base_name,
    p.display_name as player_name,
    ST_Point(ba.longitude, ba.latitude) as location
FROM base_activities ba
JOIN player_bases pb ON ba.base_id = pb.id
JOIN players p ON ba.player_id = p.id
WHERE pb.is_active = true AND p.is_active = true
ORDER BY ba.created_at DESC
LIMIT 100;

-- Base connection network view
CREATE VIEW base_connection_network AS
SELECT 
    bc.id as connection_id,
    bc.connection_type,
    bc.strength,
    bc.established_at,
    pb_a.name as base_a_name,
    pb_b.name as base_b_name,
    p_a.display_name as owner_a_name,
    p_b.display_name as owner_b_name,
    ST_Distance(
        ST_Point(pb_a.longitude, pb_a.latitude)::geography,
        ST_Point(pb_b.longitude, pb_b.latitude)::geography
    ) as distance_meters
FROM base_connections bc
JOIN player_bases pb_a ON bc.base_a_id = pb_a.id
JOIN player_bases pb_b ON bc.base_b_id = pb_b.id
JOIN players p_a ON pb_a.player_id = p_a.id
JOIN players p_b ON pb_b.player_id = p_b.id
WHERE bc.is_active = true 
AND pb_a.is_active = true 
AND pb_b.is_active = true
AND p_a.is_active = true 
AND p_b.is_active = true
ORDER BY bc.strength DESC, distance_meters ASC;
