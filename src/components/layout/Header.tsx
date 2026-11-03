import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { Menu, X, Search, Plus, Bell, User, LogOut, Settings, LayoutDashboard, FileText, Users, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (profile) {
      fetchUnreadCount();
    }
  }, [profile]);

  const fetchUnreadCount = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', profile!.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('recipient_id', currentUser.id)
          .eq('is_read', false);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Explore Problems', href: '/explore' },
    { name: 'Research', href: '/research' },
    { name: 'Teams', href: '/teams' },
    { name: 'Breakthroughs', href: '/breakthroughs' },
  ];

  const isAdmin = profile?.skills?.includes('admin') || false;

  if (authLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-near-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2" aria-label="BT Home">
              <span className="heading-3 font-bold text-electric-lime">BT</span>
              <span className="text-sm text-muted-text hidden sm:block">BreakThru</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-8 w-32 bg-gray-800 rounded animate-pulse" />
              <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-near-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="BT Home">
            <span className="heading-3 font-bold text-electric-lime">BT</span>
            <span className="text-sm text-muted-text hidden sm:block">BreakThru</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  location.pathname === item.href
                    ? 'text-electric-lime'
                    : 'text-muted-text hover:text-warm-off-white'
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-lime" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="search"
                placeholder="Search problems..."
                className="input-field pl-10 pr-4 w-64 sm:w-80 bg-gray-900/50 placeholder:text-muted-text focus:w-96"
                aria-label="Search problems"
              />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted-text hover:text-warm-off-white transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Notifications */}
            {user && (
              <Dropdown
                trigger={
                  <button className="relative p-2 text-muted-text hover:text-warm-off-white transition-colors rounded-lg" aria-label="Notifications">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-electric-lime text-near-black text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                }
                items={[
                  { label: 'View all notifications', onClick: () => { navigate('/notifications'); }, icon: <Bell className="w-4 h-4" /> },
                  { label: 'Mark all as read', onClick: markAllAsRead, icon: <Check className="w-4 h-4" /> },
                ]}
                align="right"
              />
            )}

            {/* User Menu */}
            {user ? (
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors" aria-label="User menu">
                    <Avatar
                      src={profile?.avatar_url || undefined}
                      alt={profile?.full_name || profile?.username || 'User'}
                      size="sm"
                      fallback={profile?.full_name || profile?.username || 'User'}
                    />
                    <span className="hidden sm:block text-sm font-medium text-warm-off-white">
                      {profile?.full_name || profile?.username || 'User'}
                    </span>
                  </button>
                }
                items={[
                  { label: 'Profile', onClick: () => navigate('/profile'), icon: <User className="w-4 h-4" /> },
                  { label: 'My BTs', onClick: () => navigate('/my-bts'), icon: <FileText className="w-4 h-4" /> },
                  { label: 'My Teams', onClick: () => navigate('/my-teams'), icon: <Users className="w-4 h-4" /> },
                  { label: 'Settings', onClick: () => navigate('/settings'), icon: <Settings className="w-4 h-4" /> },
                  { label: isAdmin ? 'Admin Dashboard' : 'Drop a BT', onClick: () => navigate(isAdmin ? '/admin' : '/submit'), icon: isAdmin ? <LayoutDashboard className="w-4 h-4" /> : <Plus className="w-4 h-4" /> },
                  { label: '---', onClick: () => {}, disabled: true },
                  { label: 'Sign out', onClick: handleSignOut, icon: <LogOut className="w-4 h-4" />, danger: true },
                ]}
                align="right"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-800 animate-slide-down">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-3 py-2.5 text-base font-medium rounded-lg transition-colors',
                    location.pathname === item.href
                      ? 'bg-electric-lime/10 text-electric-lime'
                      : 'text-muted-text hover:text-warm-off-white hover:bg-gray-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-800 my-2" />
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2.5 text-base font-medium text-muted-text hover:text-warm-off-white hover:bg-gray-900 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/submit"
                    className="px-3 py-2.5 text-base font-medium text-near-black bg-electric-lime hover:bg-lime-400 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Drop a BT
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2.5 text-base font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors text-left w-full"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2.5 text-base font-medium text-muted-text hover:text-warm-off-white hover:bg-gray-900 rounded-lg transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2.5 text-base font-medium text-near-black bg-electric-lime hover:bg-lime-400 rounded-lg transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}