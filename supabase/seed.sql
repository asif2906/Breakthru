-- BT (BreakThru) Platform - Development Seed Data & Notification Functions
-- Run this after migrations in Supabase SQL Editor

-- ============================================================================
-- NOTIFICATION HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION create_notification(
  p_recipient_id UUID,
  p_actor_id UUID,
  p_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_message TEXT
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (recipient_id, actor_id, type, entity_type, entity_id, message)
  VALUES (p_recipient_id, p_actor_id, p_type, p_entity_type, p_entity_id, p_message)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC NOTIFICATIONS
-- ============================================================================

-- Notify when someone replies to a discussion
CREATE OR REPLACE FUNCTION notify_discussion_reply()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_author UUID;
  v_bt_title TEXT;
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    SELECT author_id INTO v_parent_author FROM discussions WHERE id = NEW.parent_id;

    IF v_parent_author IS NOT NULL AND v_parent_author != NEW.author_id THEN
      SELECT title INTO v_bt_title FROM bts WHERE id = NEW.bt_id;

      PERFORM create_notification(
        v_parent_author,
        NEW.author_id,
        'discussion_reply',
        'discussion',
        NEW.id,
        'Replied to your comment on "' || v_bt_title || '"'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_discussion_reply ON discussions;
CREATE TRIGGER trigger_notify_discussion_reply
AFTER INSERT ON discussions
FOR EACH ROW EXECUTE FUNCTION notify_discussion_reply();

-- Notify team join requests
CREATE OR REPLACE FUNCTION notify_team_join_request()
RETURNS TRIGGER AS $$
DECLARE
  v_team_leads UUID[];
  v_team_name TEXT;
  v_lead UUID;
BEGIN
  SELECT array_agg(user_id) INTO v_team_leads
  FROM team_members
  WHERE team_id = NEW.team_id AND role = 'lead' AND membership_status = 'active';

  SELECT name INTO v_team_name FROM teams WHERE id = NEW.team_id;

  IF v_team_leads IS NOT NULL THEN
    FOREACH v_lead IN ARRAY v_team_leads LOOP
      PERFORM create_notification(
        v_lead,
        NEW.user_id,
        'join_request',
        'team',
        NEW.team_id,
        'Requested to join "' || v_team_name || '"'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_team_join_request ON team_join_requests;
CREATE TRIGGER trigger_notify_team_join_request
AFTER INSERT ON team_join_requests
FOR EACH ROW EXECUTE FUNCTION notify_team_join_request();

-- Notify when join request is accepted
CREATE OR REPLACE FUNCTION notify_join_request_accepted()
RETURNS TRIGGER AS $$
DECLARE
  v_team_name TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    SELECT name INTO v_team_name FROM teams WHERE id = NEW.team_id;

    PERFORM create_notification(
      NEW.user_id,
      NULL,
      'team_invitation',
      'team',
      NEW.team_id,
      'Your request to join "' || v_team_name || '" was accepted'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_join_request_accepted ON team_join_requests;
CREATE TRIGGER trigger_notify_join_request_accepted
AFTER UPDATE ON team_join_requests
FOR EACH ROW EXECUTE FUNCTION notify_join_request_accepted();

-- Notify BT submission status changes
CREATE OR REPLACE FUNCTION notify_bt_submission_decision()
RETURNS TRIGGER AS $$
DECLARE
  v_message TEXT;
BEGIN
  IF NEW.review_status != OLD.review_status THEN
    CASE NEW.review_status
      WHEN 'approved' THEN
        v_message := 'Your BT "' || NEW.title || '" has been approved and published';
      WHEN 'rejected' THEN
        v_message := 'Your BT "' || NEW.title || '" was not approved';
      WHEN 'changes_requested' THEN
        v_message := 'Changes requested for your BT "' || NEW.title || '"';
      ELSE
        v_message := 'Your BT "' || NEW.title || '" status updated to ' || NEW.review_status;
    END CASE;

    PERFORM create_notification(
      NEW.creator_id,
      NULL,
      'submission_decision',
      'bt',
      NEW.id,
      v_message
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_bt_submission_decision ON bts;
CREATE TRIGGER trigger_notify_bt_submission_decision
AFTER UPDATE ON bts
FOR EACH ROW EXECUTE FUNCTION notify_bt_submission_decision();

-- Notify BT followers of new discussions
CREATE OR REPLACE FUNCTION notify_bt_followers_new_discussion()
RETURNS TRIGGER AS $$
DECLARE
  v_follower_ids UUID[];
  v_bt_title TEXT;
  v_follower UUID;
BEGIN
  SELECT title INTO v_bt_title FROM bts WHERE id = NEW.bt_id;

  SELECT array_agg(user_id) INTO v_follower_ids
  FROM bt_followers
  WHERE bt_id = NEW.bt_id AND user_id != NEW.author_id;

  IF v_follower_ids IS NOT NULL THEN
    FOREACH v_follower IN ARRAY v_follower_ids LOOP
      PERFORM create_notification(
        v_follower,
        NEW.author_id,
        'bt_update',
        'bt',
        NEW.bt_id,
        'New discussion on "' || v_bt_title || '"'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_bt_followers_new_discussion ON discussions;
CREATE TRIGGER trigger_notify_bt_followers_new_discussion
AFTER INSERT ON discussions
FOR EACH ROW EXECUTE FUNCTION notify_bt_followers_new_discussion();

-- Notify team members of team updates
CREATE OR REPLACE FUNCTION notify_team_members_update()
RETURNS TRIGGER AS $$
DECLARE
  v_member_ids UUID[];
  v_team_name TEXT;
  v_member UUID;
BEGIN
  SELECT name INTO v_team_name FROM teams WHERE id = NEW.team_id;

  SELECT array_agg(user_id) INTO v_member_ids
  FROM team_members
  WHERE team_id = NEW.team_id AND membership_status = 'active' AND user_id != NEW.author_id;

  IF v_member_ids IS NOT NULL THEN
    FOREACH v_member IN ARRAY v_member_ids LOOP
      PERFORM create_notification(
        v_member,
        NEW.author_id,
        'team_progress',
        'team',
        NEW.team_id,
        'New update in "' || v_team_name || '"'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_team_members_update ON team_updates;
CREATE TRIGGER trigger_notify_team_members_update
AFTER INSERT ON team_updates
FOR EACH ROW EXECUTE FUNCTION notify_team_members_update();

-- Notify when breakthrough is published
CREATE OR REPLACE FUNCTION notify_breakthrough_published()
RETURNS TRIGGER AS $$
DECLARE
  v_bt_title TEXT;
  v_team_member_ids UUID[];
  v_bt_follower_ids UUID[];
  v_member UUID;
  v_follower UUID;
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    SELECT title INTO v_bt_title FROM bts WHERE id = NEW.bt_id;

    IF NEW.team_id IS NOT NULL THEN
      SELECT array_agg(user_id) INTO v_team_member_ids
      FROM team_members
      WHERE team_id = NEW.team_id AND membership_status = 'active' AND user_id != NEW.created_by;

      IF v_team_member_ids IS NOT NULL THEN
        FOREACH v_member IN ARRAY v_team_member_ids LOOP
          PERFORM create_notification(
            v_member,
            NEW.created_by,
            'breakthrough_published',
            'breakthrough',
            NEW.id,
            'Breakthrough published: "' || NEW.title || '"'
          );
        END LOOP;
      END IF;
    END IF;

    SELECT array_agg(user_id) INTO v_bt_follower_ids
    FROM bt_followers
    WHERE bt_id = NEW.bt_id AND user_id != NEW.created_by;

    IF v_bt_follower_ids IS NOT NULL THEN
      FOREACH v_follower IN ARRAY v_bt_follower_ids LOOP
        PERFORM create_notification(
          v_follower,
          NEW.created_by,
          'breakthrough_published',
          'breakthrough',
          NEW.id,
          'New breakthrough on "' || v_bt_title || '": ' || NEW.title
        );
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_breakthrough_published ON breakthroughs;
CREATE TRIGGER trigger_notify_breakthrough_published
AFTER UPDATE ON breakthroughs
FOR EACH ROW EXECUTE FUNCTION notify_breakthrough_published();

-- ============================================================================
-- FUNCTION TO ASSIGN DEFAULT USER ROLE
-- ============================================================================

CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_assign_default_role ON profiles;
CREATE TRIGGER trigger_assign_default_role
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION assign_default_role();

-- ============================================================================
-- FUNCTION TO CREATE PROFILE ON USER SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;