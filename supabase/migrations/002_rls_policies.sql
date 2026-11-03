-- BT (BreakThru) Platform - Row Level Security Policies
-- Run this migration after 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bt_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE bt_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE breakthroughs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bt_followers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if current user is admin or moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM user_roles WHERE user_id = $1 AND role IN ('admin', 'moderator') LIMIT 1;
  RETURN user_role IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM user_roles WHERE user_id = $1 AND role = 'admin' LIMIT 1;
  RETURN user_role IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is team lead or admin
CREATE OR REPLACE FUNCTION is_team_lead_or_admin(team_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  member_role TEXT;
BEGIN
  -- Check if user is team lead
  SELECT role INTO member_role FROM team_members
  WHERE team_id = $1 AND user_id = $2 AND membership_status = 'active'
  AND role IN ('lead', 'advisor') LIMIT 1;

  IF member_role IS NOT NULL THEN
    RETURN TRUE;
  END IF;

  -- Check if user is admin
  RETURN is_admin(user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is team member (active)
CREATE OR REPLACE FUNCTION is_team_member(team_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  member_status TEXT;
BEGIN
  SELECT membership_status INTO member_status FROM team_members
  WHERE team_id = $1 AND user_id = $2 AND membership_status = 'active' LIMIT 1;
  RETURN member_status IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Everyone can view profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- BTS POLICIES
-- ============================================================================

-- Approved BTs are viewable by everyone
CREATE POLICY "Approved BTs are public" ON bts
  FOR SELECT USING (review_status = 'approved');

-- Creators can view their own BTs regardless of status
CREATE POLICY "Creators can view own BTs" ON bts
  FOR SELECT USING (creator_id = auth.uid());

-- Admins/moderators can view all BTs
CREATE POLICY "Admins and moderators can view all BTs" ON bts
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Authenticated users can create BTs (drafts)
CREATE POLICY "Users can create BTs" ON bts
  FOR INSERT WITH CHECK (creator_id = auth.uid());

-- Creators can update their own BTs if draft or changes_requested
CREATE POLICY "Creators can update own BTs" ON bts
  FOR UPDATE USING (creator_id = auth.uid() AND review_status IN ('draft', 'changes_requested'))
  WITH CHECK (creator_id = auth.uid() AND review_status IN ('draft', 'changes_requested'));

-- Creators can submit their BTs for review
CREATE POLICY "Creators can submit BTs" ON bts
  FOR UPDATE USING (creator_id = auth.uid() AND review_status = 'draft')
  WITH CHECK (creator_id = auth.uid() AND review_status = 'submitted');

-- Admins/moderators can update any BT (review workflow)
CREATE POLICY "Moderators can review BTs" ON bts
  FOR UPDATE USING (is_admin_or_moderator(auth.uid()));

-- Admins can delete BTs
CREATE POLICY "Admins can delete BTs" ON bts
  FOR DELETE USING (is_admin(auth.uid()));

-- ============================================================================
-- BT SKILLS POLICIES
-- ============================================================================

-- Skills are viewable with their BT
CREATE POLICY "BT skills viewable with BT" ON bt_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bts WHERE bts.id = bt_skills.bt_id
      AND (bts.review_status = 'approved' OR bts.creator_id = auth.uid() OR is_admin_or_moderator(auth.uid()))
    )
  );

-- BT creators can manage skills
CREATE POLICY "BT creators can manage skills" ON bt_skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bts WHERE bts.id = bt_skills.bt_id AND bts.creator_id = auth.uid()
    )
  );

-- Admins/moderators can manage all skills
CREATE POLICY "Admins can manage all BT skills" ON bt_skills
  FOR ALL USING (is_admin_or_moderator(auth.uid()));

-- ============================================================================
-- RESEARCH REFERENCES POLICIES
-- ============================================================================

-- References linked to approved BTs are public
CREATE POLICY "References linked to approved BTs are public" ON research_references
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bt_references br
      JOIN bts b ON b.id = br.bt_id
      WHERE br.reference_id = research_references.id AND b.review_status = 'approved'
    )
  );

-- Creators can view their own references
CREATE POLICY "Users can view own references" ON research_references
  FOR SELECT USING (created_by = auth.uid());

-- Admins/moderators can view all references
CREATE POLICY "Admins can view all references" ON research_references
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Authenticated users can create references
CREATE POLICY "Users can create references" ON research_references
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Creators can update their own references
CREATE POLICY "Users can update own references" ON research_references
  FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Admins can manage all references
CREATE POLICY "Admins can manage all references" ON research_references
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- BT REFERENCES POLICIES
-- ============================================================================

-- Junction table viewable with BT
CREATE POLICY "BT references viewable with BT" ON bt_references
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bts WHERE bts.id = bt_references.bt_id
      AND (bts.review_status = 'approved' OR bts.creator_id = auth.uid() OR is_admin_or_moderator(auth.uid()))
    )
  );

-- BT creators can manage references
CREATE POLICY "BT creators can manage references" ON bt_references
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bts WHERE bts.id = bt_references.bt_id AND bts.creator_id = auth.uid()
    )
  );

-- Admins/moderators can manage all
CREATE POLICY "Admins can manage all BT references" ON bt_references
  FOR ALL USING (is_admin_or_moderator(auth.uid()));

-- ============================================================================
-- DISCUSSIONS POLICIES
-- ============================================================================

-- Discussions on approved BTs are public
CREATE POLICY "Discussions on approved BTs are public" ON discussions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bts WHERE bts.id = discussions.bt_id AND bts.review_status = 'approved'
    )
  );

-- Authors can view their own discussions
CREATE POLICY "Authors can view own discussions" ON discussions
  FOR SELECT USING (author_id = auth.uid());

-- Team members can view discussions on their team's BT
CREATE POLICY "Team members can view team BT discussions" ON discussions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE t.bt_id = discussions.bt_id AND tm.user_id = auth.uid() AND tm.membership_status = 'active'
    )
  );

-- Admins/moderators can view all discussions
CREATE POLICY "Admins can view all discussions" ON discussions
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Authenticated users can create discussions on approved BTs
CREATE POLICY "Users can create discussions" ON discussions
  FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM bts WHERE bts.id = discussions.bt_id AND bts.review_status = 'approved')
  );

-- Authors can update their own discussions
CREATE POLICY "Authors can update own discussions" ON discussions
  FOR UPDATE USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

-- Authors can delete their own discussions
CREATE POLICY "Authors can delete own discussions" ON discussions
  FOR DELETE USING (author_id = auth.uid());

-- Admins/moderators can manage all discussions
CREATE POLICY "Admins can manage all discussions" ON discussions
  FOR ALL USING (is_admin_or_moderator(auth.uid()));

-- ============================================================================
-- TEAMS POLICIES
-- ============================================================================

-- Teams linked to approved BTs are public
CREATE POLICY "Teams on approved BTs are public" ON teams
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bts WHERE bts.id = teams.bt_id AND bts.review_status = 'approved')
  );

-- Team members can view their team
CREATE POLICY "Team members can view own team" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
    )
  );

-- BT creators can view teams on their BT
CREATE POLICY "BT creators can view teams on their BT" ON teams
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bts WHERE bts.id = teams.bt_id AND bts.creator_id = auth.uid())
  );

-- Admins/moderators can view all teams
CREATE POLICY "Admins can view all teams" ON teams
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Authenticated users can create teams on approved BTs
CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM bts WHERE bts.id = teams.bt_id AND bts.review_status = 'approved')
  );

-- Team leads/admins can update team
CREATE POLICY "Team leads can update team" ON teams
  FOR UPDATE USING (is_team_lead_or_admin(id, auth.uid())) WITH CHECK (is_team_lead_or_admin(id, auth.uid()));

-- Team leads/admins can delete team
CREATE POLICY "Team leads can delete team" ON teams
  FOR DELETE USING (is_team_lead_or_admin(id, auth.uid()));

-- Admins can manage all teams
CREATE POLICY "Admins can manage all teams" ON teams
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- TEAM MEMBERS POLICIES
-- ============================================================================

-- Team members viewable by team members
CREATE POLICY "Team members viewable by team members" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm2
      WHERE tm2.team_id = team_members.team_id AND tm2.user_id = auth.uid()
      AND tm2.membership_status = 'active'
    )
  );

-- BT creators can view team members on their BT
CREATE POLICY "BT creators can view team members" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN bts b ON b.id = t.bt_id
      WHERE t.id = team_members.team_id AND b.creator_id = auth.uid()
    )
  );

-- Admins/moderators can view all team members
CREATE POLICY "Admins can view all team members" ON team_members
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Team leads can manage members
CREATE POLICY "Team leads can manage members" ON team_members
  FOR ALL USING (is_team_lead_or_admin(team_id, auth.uid()));

-- Users can request to join (insert with pending status)
CREATE POLICY "Users can request to join teams" ON team_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND membership_status = 'pending' AND
    EXISTS (
      SELECT 1 FROM teams WHERE teams.id = team_members.team_id
    )
  );

-- Users can remove themselves from team
CREATE POLICY "Users can leave teams" ON team_members
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- TEAM JOIN REQUESTS POLICIES
-- ============================================================================

-- Users can view their own join requests
CREATE POLICY "Users can view own join requests" ON team_join_requests
  FOR SELECT USING (user_id = auth.uid());

-- Team leads can view join requests for their team
CREATE POLICY "Team leads can view join requests" ON team_join_requests
  FOR SELECT USING (is_team_lead_or_admin(team_id, auth.uid()));

-- Admins/moderators can view all join requests
CREATE POLICY "Admins can view all join requests" ON team_join_requests
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Users can create join requests
CREATE POLICY "Users can create join requests" ON team_join_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Team leads can update join requests (accept/reject)
CREATE POLICY "Team leads can update join requests" ON team_join_requests
  FOR UPDATE USING (is_team_lead_or_admin(team_id, auth.uid())) WITH CHECK (is_team_lead_or_admin(team_id, auth.uid()));

-- ============================================================================
-- TEAM OBJECTIVES POLICIES
-- ============================================================================

-- Team members can view objectives
CREATE POLICY "Team members can view objectives" ON team_objectives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = team_objectives.team_id
      AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
    )
  );

-- Team leads can manage objectives
CREATE POLICY "Team leads can manage objectives" ON team_objectives
  FOR ALL USING (is_team_lead_or_admin(team_id, auth.uid()));

-- Assignees can update their objectives
CREATE POLICY "Assignees can update own objectives" ON team_objectives
  FOR UPDATE USING (assigned_to = auth.uid()) WITH CHECK (assigned_to = auth.uid());

-- ============================================================================
-- TEAM UPDATES POLICIES
-- ============================================================================

-- Team members can view updates
CREATE POLICY "Team members can view updates" ON team_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = team_updates.team_id
      AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
    )
  );

-- Team members can create updates
CREATE POLICY "Team members can create updates" ON team_updates
  FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = team_updates.team_id
      AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
    )
  );

-- Authors can update their updates
CREATE POLICY "Authors can update own updates" ON team_updates
  FOR UPDATE USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

-- Authors can delete their updates
CREATE POLICY "Authors can delete own updates" ON team_updates
  FOR DELETE USING (author_id = auth.uid());

-- Team leads can delete any team update
CREATE POLICY "Team leads can delete team updates" ON team_updates
  FOR DELETE USING (is_team_lead_or_admin(team_id, auth.uid()));

-- ============================================================================
-- BREAKTHROUGHS POLICIES
-- ============================================================================

-- Published breakthroughs are public
CREATE POLICY "Published breakthroughs are public" ON breakthroughs
  FOR SELECT USING (status = 'published');

-- Team members can view team breakthroughs
CREATE POLICY "Team members can view team breakthroughs" ON breakthroughs
  FOR SELECT USING (
    team_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = breakthroughs.team_id
      AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
    )
  );

-- BT creators can view breakthroughs on their BT
CREATE POLICY "BT creators can view breakthroughs" ON breakthroughs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bts WHERE bts.id = breakthroughs.bt_id AND bts.creator_id = auth.uid())
  );

-- Breakthrough creators can view their own
CREATE POLICY "Creators can view own breakthroughs" ON breakthroughs
  FOR SELECT USING (created_by = auth.uid());

-- Admins/moderators can view all
CREATE POLICY "Admins can view all breakthroughs" ON breakthroughs
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Team members can create breakthroughs
CREATE POLICY "Team members can create breakthroughs" ON breakthroughs
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (
      (team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM team_members WHERE team_members.team_id = breakthroughs.team_id
        AND team_members.user_id = auth.uid() AND team_members.membership_status = 'active'
      )) OR
      EXISTS (SELECT 1 FROM bts WHERE bts.id = breakthroughs.bt_id AND bts.creator_id = auth.uid())
    )
  );

-- Creators can update their breakthroughs
CREATE POLICY "Creators can update own breakthroughs" ON breakthroughs
  FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Team leads can update team breakthroughs
CREATE POLICY "Team leads can update team breakthroughs" ON breakthroughs
  FOR UPDATE USING (
    team_id IS NOT NULL AND is_team_lead_or_admin(team_id, auth.uid())
  ) WITH CHECK (
    team_id IS NOT NULL AND is_team_lead_or_admin(team_id, auth.uid())
  );

-- Admins can manage all
CREATE POLICY "Admins can manage all breakthroughs" ON breakthroughs
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- System can create notifications (via functions)
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());

-- ============================================================================
-- REPORTS POLICIES
-- ============================================================================

-- Reporters can view their own reports
CREATE POLICY "Reporters can view own reports" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

-- Admins/moderators can view all reports
CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (is_admin_or_moderator(auth.uid()));

-- Authenticated users can create reports
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Admins/moderators can update reports
CREATE POLICY "Admins can update reports" ON reports
  FOR UPDATE USING (is_admin_or_moderator(auth.uid()));

-- ============================================================================
-- USER ROLES POLICIES
-- ============================================================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (is_admin(auth.uid()));

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================================
-- BT FOLLOWERS POLICIES
-- ============================================================================

-- Users can view their own follows
CREATE POLICY "Users can view own follows" ON bt_followers
  FOR SELECT USING (user_id = auth.uid());

-- BT creators can view followers
CREATE POLICY "BT creators can view followers" ON bt_followers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bts WHERE bts.id = bt_followers.bt_id AND bts.creator_id = auth.uid())
  );

-- Admins can view all
CREATE POLICY "Admins can view all followers" ON bt_followers
  FOR SELECT USING (is_admin(auth.uid()));

-- Users can follow/unfollow BTs
CREATE POLICY "Users can manage own follows" ON bt_followers
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());