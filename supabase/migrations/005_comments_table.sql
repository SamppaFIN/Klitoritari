-- Comments table for Eldritch Sanctuary
-- This migration creates a comments system for community interaction

-- Create comments table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    base_id UUID REFERENCES player_bases(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text', -- text, wisdom, blessing, warning
    is_public BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    wisdom_level INTEGER DEFAULT 1,
    energy_contribution INTEGER DEFAULT 0,
    comment_data JSONB DEFAULT '{}'::jsonb
);

-- Add foreign key constraint for user_id
ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES players(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_base_id ON comments(base_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_public ON comments(is_public) WHERE is_public = true;

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can view public comments" ON comments
    FOR SELECT USING (is_public = true AND deleted_at IS NULL);

CREATE POLICY "Users can manage own comments" ON comments
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Base owners can moderate comments" ON comments
    FOR ALL USING (
        base_id IN (
            SELECT id FROM player_bases WHERE player_id = auth.uid()
        ) AND deleted_at IS NULL
    );

-- Function to update comment timestamps
CREATE OR REPLACE FUNCTION update_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment updates
CREATE TRIGGER trigger_update_comment_timestamp
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comment_timestamp();

-- Function to get comment thread
CREATE OR REPLACE FUNCTION get_comment_thread(comment_uuid UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content TEXT,
    content_type VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    wisdom_level INTEGER,
    author_name VARCHAR(100),
    reply_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.user_id,
        c.content,
        c.content_type,
        c.created_at,
        c.wisdom_level,
        p.display_name as author_name,
        COUNT(replies.id) as reply_count
    FROM comments c
    JOIN players p ON c.user_id = p.id
    LEFT JOIN comments replies ON replies.parent_comment_id = c.id
    WHERE c.id = comment_uuid 
    AND c.deleted_at IS NULL
    AND c.is_public = true
    GROUP BY c.id, c.user_id, c.content, c.content_type, c.created_at, c.wisdom_level, p.display_name;
END;
$$ LANGUAGE plpgsql;
