-- Drop existing policies
DROP POLICY IF EXISTS "Allow public access to contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public access to deals" ON deals;
DROP POLICY IF EXISTS "Allow public access to automations" ON automations;
DROP POLICY IF EXISTS "Allow public access to tasks" ON tasks;
DROP POLICY IF EXISTS "Allow public access to communications" ON communications;
DROP POLICY IF EXISTS "Allow public access to activities" ON activities;

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_contacts_user_id ON contacts;
DROP TRIGGER IF EXISTS set_deals_user_id ON deals;
DROP TRIGGER IF EXISTS set_automations_user_id ON automations;
DROP TRIGGER IF EXISTS set_tasks_user_id ON tasks;
DROP TRIGGER IF EXISTS set_communications_user_id ON communications;
DROP TRIGGER IF EXISTS set_activities_user_id ON activities;

-- Drop columns if they exist (to recreate with correct type)
ALTER TABLE contacts DROP COLUMN IF EXISTS user_id;
ALTER TABLE deals DROP COLUMN IF EXISTS user_id;
ALTER TABLE automations DROP COLUMN IF EXISTS user_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;
ALTER TABLE communications DROP COLUMN IF EXISTS user_id;
ALTER TABLE activities DROP COLUMN IF EXISTS user_id;

-- Add user_id columns with correct UUID type
ALTER TABLE contacts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE deals ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE automations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE communications ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE activities ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add avatar_url to contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light',
    timezone TEXT DEFAULT 'UTC',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    currency TEXT DEFAULT 'USD',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user storage table
CREATE TABLE IF NOT EXISTS user_storage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    bucket_id TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_communications_user_id ON communications(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_storage_user_id ON user_storage(user_id);

-- Create user-specific RLS policies
CREATE POLICY "Users can only access their own contacts"
  ON contacts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own deals"
  ON deals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own automations"
  ON automations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own tasks"
  ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own communications"
  ON communications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own activities"
  ON activities FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable RLS on new tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_storage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own storage"
  ON user_storage FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create function to auto-set user_id
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-set user_id
CREATE TRIGGER set_contacts_user_id BEFORE INSERT ON contacts
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_deals_user_id BEFORE INSERT ON deals
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_automations_user_id BEFORE INSERT ON automations
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_tasks_user_id BEFORE INSERT ON tasks
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_communications_user_id BEFORE INSERT ON communications
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
CREATE TRIGGER set_activities_user_id BEFORE INSERT ON activities
    FOR EACH ROW EXECUTE FUNCTION set_user_id();
