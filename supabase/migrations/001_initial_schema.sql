-- BT (BreakThru) Platform - Initial Database Schema
-- Run this migration in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  institution TEXT,
  expertise TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  scholar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_full_name ON profiles(full_name);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Artificial Intelligence', 'artificial-intelligence', 'Machine learning, neural networks, AI research and applications'),
('Energy', 'energy', 'Renewable energy, fusion, battery technology, grid systems'),
('Biotechnology', 'biotechnology', 'Genetic engineering, synthetic biology, medical research'),
('Robotics', 'robotics', 'Autonomous systems, humanoid robots, industrial automation'),
('Semiconductors', 'semiconductors', 'Chip design, fabrication, materials, quantum devices'),
('Quantum Computing', 'quantum-computing', 'Quantum algorithms, hardware, error correction, applications'),
('Materials Science', 'materials-science', 'Advanced materials, nanomaterials, metamaterials'),
('Space', 'space', 'Space exploration, propulsion, satellites, planetary science');

-- ============================================================================
-- BTS (BREAKTHRU PROBLEMS) TABLE
-- ============================================================================
CREATE TABLE bts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  importance TEXT NOT NULL,
  limitations TEXT,
  previous_attempts TEXT,
  open_questions TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'teams_working', 'solved')),
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'changes_requested')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for bts
CREATE INDEX idx_bts_category ON bts(category_id);
CREATE INDEX idx_bts_creator ON bts(creator_id);
CREATE INDEX idx_bts_status ON bts(status);
CREATE INDEX idx_bts_review_status ON bts(review_status);
CREATE INDEX idx_bts_created_at ON bts(created_at DESC);
CREATE INDEX idx_bts_slug ON bts(slug);

-- Full-text search index
ALTER TABLE bts ADD COLUMN search_vector tsvector;
CREATE INDEX idx_bts_search ON bts USING GIN(search_vector);

-- Trigger to update search_vector
CREATE OR REPLACE FUNCTION update_bts_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.summary, '') || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bts_search_vector
BEFORE INSERT OR UPDATE ON bts
FOR EACH ROW EXECUTE FUNCTION update_bts_search_vector();

-- ============================================================================
-- BT SKILLS TABLE
-- ============================================================================
CREATE TABLE bt_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bt_id, skill_name)
);

CREATE INDEX idx_bt_skills_bt ON bt_skills(bt_id);
CREATE INDEX idx_bt_skills_name ON bt_skills(skill_name);

-- ============================================================================
-- RESEARCH REFERENCES TABLE
-- ============================================================================
CREATE TABLE research_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  publication TEXT,
  publication_year INTEGER,
  doi TEXT UNIQUE,
  source_url TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_refs_doi ON research_references(doi);
CREATE INDEX idx_research_refs_created_by ON research_references(created_by);
CREATE INDEX idx_research_refs_year ON research_references(publication_year DESC);

-- Full-text search for references
ALTER TABLE research_references ADD COLUMN search_vector tsvector;
CREATE INDEX idx_research_refs_search ON research_references USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_research_refs_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(array_to_string(NEW.authors, ' '), '') || ' ' || COALESCE(NEW.publication, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_research_refs_search_vector
BEFORE INSERT OR UPDATE ON research_references
FOR EACH ROW EXECUTE FUNCTION update_research_refs_search_vector();

-- ============================================================================
-- BT REFERENCES (JUNCTION TABLE)
-- ============================================================================
CREATE TABLE bt_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES research_references(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bt_id, reference_id)
);

CREATE INDEX idx_bt_refs_bt ON bt_references(bt_id);
CREATE INDEX idx_bt_refs_reference ON bt_references(reference_id);

-- ============================================================================
-- DISCUSSIONS TABLE
-- ============================================================================
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('question', 'hypothesis', 'evidence', 'critique', 'update')),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discussions_bt ON discussions(bt_id);
CREATE INDEX idx_discussions_author ON discussions(author_id);
CREATE INDEX idx_discussions_parent ON discussions(parent_id);
CREATE INDEX idx_discussions_type ON discussions(contribution_type);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_bt ON teams(bt_id);
CREATE INDEX idx_teams_creator ON teams(created_by);
CREATE INDEX idx_teams_status ON teams(status);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member', 'advisor')),
  membership_status TEXT NOT NULL DEFAULT 'pending' CHECK (membership_status IN ('pending', 'active', 'removed')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(membership_status);

-- ============================================================================
-- TEAM JOIN REQUESTS TABLE
-- ============================================================================
CREATE TABLE team_join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_join_requests_team ON team_join_requests(team_id);
CREATE INDEX idx_team_join_requests_user ON team_join_requests(user_id);
CREATE INDEX idx_team_join_requests_status ON team_join_requests(status);

-- ============================================================================
-- TEAM OBJECTIVES TABLE
-- ============================================================================
CREATE TABLE team_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_objectives_team ON team_objectives(team_id);
CREATE INDEX idx_team_objectives_assigned ON team_objectives(assigned_to);
CREATE INDEX idx_team_objectives_status ON team_objectives(status);

-- ============================================================================
-- TEAM UPDATES TABLE
-- ============================================================================
CREATE TABLE team_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_updates_team ON team_updates(team_id);
CREATE INDEX idx_team_updates_author ON team_updates(author_id);
CREATE INDEX idx_team_updates_created_at ON team_updates(created_at DESC);

-- ============================================================================
-- BREAKTHROUGHS TABLE
-- ============================================================================
CREATE TABLE breakthroughs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  breakthrough_type TEXT NOT NULL CHECK (breakthrough_type IN ('research_paper', 'prototype', 'open_source', 'product', 'startup', 'experiment', 'finding')),
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  external_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_breakthroughs_bt ON breakthroughs(bt_id);
CREATE INDEX idx_breakthroughs_team ON breakthroughs(team_id);
CREATE INDEX idx_breakthroughs_creator ON breakthroughs(created_by);
CREATE INDEX idx_breakthroughs_type ON breakthroughs(breakthrough_type);
CREATE INDEX idx_breakthroughs_status ON breakthroughs(status);
CREATE INDEX idx_breakthroughs_created_at ON breakthroughs(created_at DESC);

-- Full-text search for breakthroughs
ALTER TABLE breakthroughs ADD COLUMN search_vector tsvector;
CREATE INDEX idx_breakthroughs_search ON breakthroughs USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_breakthroughs_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_breakthroughs_search_vector
BEFORE INSERT OR UPDATE ON breakthroughs
FOR EACH ROW EXECUTE FUNCTION update_breakthroughs_search_vector();

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'discussion_reply', 'mention', 'team_invitation', 'join_request',
    'submission_decision', 'bt_update', 'new_reference', 'team_progress', 'breakthrough_published'
  )),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- REPORTS TABLE
-- ============================================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_content_type TEXT NOT NULL CHECK (reported_content_type IN ('bt', 'discussion', 'team', 'breakthrough', 'profile')),
  reported_content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_content ON reports(reported_content_type, reported_content_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================================================
-- USER ROLES TABLE
-- ============================================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('guest', 'user', 'team_member', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================================
-- BT FOLLOWERS TABLE
-- ============================================================================
CREATE TABLE bt_followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bt_id UUID NOT NULL REFERENCES bts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bt_id, user_id)
);

CREATE INDEX idx_bt_followers_bt ON bt_followers(bt_id);
CREATE INDEX idx_bt_followers_user ON bt_followers(user_id);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bts_updated_at BEFORE UPDATE ON bts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_objectives_updated_at BEFORE UPDATE ON team_objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_breakthroughs_updated_at BEFORE UPDATE ON breakthroughs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();