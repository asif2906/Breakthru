export type UserRole = 'guest' | 'user' | 'team_member' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  institution: string | null;
  expertise: string | null;
  skills: string[] | null;
  interests: string[] | null;
  github_url: string | null;
  linkedin_url: string | null;
  scholar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export type BTStatus = 'open' | 'teams_working' | 'solved';
export type BTReviewStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';

export interface BT {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  importance: string;
  limitations: string | null;
  previous_attempts: string | null;
  open_questions: string | null;
  category_id: string;
  creator_id: string;
  status: BTStatus;
  review_status: BTReviewStatus;
  created_at: string;
  updated_at: string;
  category?: Category;
  creator?: Profile;
  skills?: BTSkill[];
  references?: ResearchReference[];
  team_count?: number;
  follower_count?: number;
  is_following?: boolean;
}

export interface BTSkill {
  id: string;
  bt_id: string;
  skill_name: string;
}

export interface ResearchReference {
  id: string;
  title: string;
  authors: string[];
  publication: string | null;
  publication_year: number | null;
  doi: string | null;
  source_url: string | null;
  created_by: string;
  created_at: string;
}

export interface BTReference {
  id: string;
  bt_id: string;
  reference_id: string;
  reference?: ResearchReference;
}

export type DiscussionContributionType = 'question' | 'hypothesis' | 'evidence' | 'critique' | 'update';

export interface Discussion {
  id: string;
  bt_id: string;
  author_id: string;
  contribution_type: DiscussionContributionType;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: Discussion[];
  reply_count?: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  bt_id: string;
  created_by: string;
  status: 'forming' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  bt?: BT;
  creator?: Profile;
  members?: TeamMember[];
  member_count?: number;
  open_positions?: number;
}

export type TeamMemberRole = 'lead' | 'member' | 'advisor';
export type MembershipStatus = 'pending' | 'active' | 'removed';

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  membership_status: MembershipStatus;
  joined_at: string;
  user?: Profile;
}

export interface TeamJoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  user?: Profile;
  team?: Team;
}

export interface TeamObjective {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
}

export interface TeamUpdate {
  id: string;
  team_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export type BreakthroughType = 'research_paper' | 'prototype' | 'open_source' | 'product' | 'startup' | 'experiment' | 'finding';
export type BreakthroughStatus = 'draft' | 'published' | 'archived';

export interface Breakthrough {
  id: string;
  title: string;
  description: string;
  breakthrough_type: BreakthroughType;
  bt_id: string;
  team_id: string | null;
  external_url: string | null;
  status: BreakthroughStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  bt?: BT;
  team?: Team;
  creator?: Profile;
}

export type NotificationType =
  | 'discussion_reply'
  | 'mention'
  | 'team_invitation'
  | 'join_request'
  | 'submission_decision'
  | 'bt_update'
  | 'new_reference'
  | 'team_progress'
  | 'breakthrough_published';

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: NotificationType;
  entity_type: string;
  entity_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  reported_content_type: 'bt' | 'discussion' | 'team' | 'breakthrough' | 'profile';
  reported_content_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  reporter?: Profile;
}

export interface UserRoleEntry {
  id: string;
  user_id: string;
  role: UserRole;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface BTFilters {
  category?: string;
  skills?: string[];
  status?: BTStatus;
  search?: string;
  sort?: 'newest' | 'recently_active' | 'most_followed' | 'most_discussed';
  page?: number;
  page_size?: number;
}

export interface TeamFilters {
  bt_id?: string;
  status?: Team['status'];
  search?: string;
  page?: number;
  page_size?: number;
}