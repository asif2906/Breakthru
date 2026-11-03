import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronRight, Search, Filter, X, Loader2, Users, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BT, Category } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

const categories = [
  { name: 'All Categories', slug: '' },
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { name: 'Energy', slug: 'energy' },
  { name: 'Biotechnology', slug: 'biotechnology' },
  { name: 'Robotics', slug: 'robotics' },
  { name: 'Semiconductors', slug: 'semiconductors' },
  { name: 'Quantum Computing', slug: 'quantum-computing' },
  { name: 'Materials Science', slug: 'materials-science' },
  { name: 'Space', slug: 'space' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'teams_working', label: 'Teams Working' },
  { value: 'solved', label: 'Solved' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'recently_active', label: 'Recently Active' },
];

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bts, setBts] = useState<BT[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 12;

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBTs();
  }, [filters.search, filters.category, filters.status, filters.sort, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategoriesData(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  };

  const fetchBTs = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      let query = supabase
        .from('bts')
        .select(`
          *,
          category:categories(*),
          creator:profiles(full_name, username, avatar_url),
          skills:bt_skills(skill_name)
        `, { count: 'exact' })
        .eq('review_status', 'approved');

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq('category.slug', filters.category);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      switch (filters.sort) {
        case 'recently_active':
          query = query.order('updated_at', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        setErrorMessage(error.message);
      } else {
        setBts(data || []);
        setTotalCount(count || 0);
        setHasMore((count || 0) > to + 1);
      }
    } catch (error: any) {
      console.error('Error fetching BTs:', error);
      setErrorMessage(error?.message || 'Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = filters.search || filters.category || filters.status;

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-near-black">
      <div className="section-container py-16 lg:py-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="heading-1 mb-4">Explore Problems</h1>
          <p className="body-lg max-w-2xl">
            Discover important unsolved problems across science and engineering.
            Filter by category, status, or search keywords to find BTs matching your expertise.
          </p>
        </div>

        {/* Error Banner if Supabase connection fails */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <div>
              <p className="font-semibold">Database Connection Issue</p>
              <p className="text-sm text-red-300/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 p-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
              <input
                type="search"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search problems, descriptions, skills..."
                className="input-field pl-12 pr-4"
                aria-label="Search problems"
              />
            </div>

            {/* Category */}
            <div className="w-full lg:w-48">
              <Select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                options={categories.map(c => ({ value: c.slug, label: c.name }))}
                placeholder="All Categories"
              />
            </div>

            {/* Status */}
            <div className="w-full lg:w-40">
              <Select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                options={statusOptions}
                placeholder="All Statuses"
              />
            </div>

            {/* Sort */}
            <div className="w-full lg:w-40">
              <Select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                options={sortOptions}
                placeholder="Sort by"
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="body-md text-muted-text">
            {totalCount} problem{totalCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading && bts.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-800 rounded-full w-20" />
                  <div className="h-6 bg-gray-800 rounded-full w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : bts.length === 0 ? (
          <div className="card text-center py-16">
            <Search className="w-12 h-12 text-muted-text mx-auto mb-4 opacity-50" />
            <h3 className="heading-4 mb-2">No approved problems yet</h3>
            <p className="body-md mb-6">Be the first to submit a problem for review!</p>
            <Link to="/submit" className="btn-primary">
              Drop a BT
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bts.map((bt) => (
                <Link
                  key={bt.id}
                  to={`/bt/${bt.slug}`}
                  className="card-hover group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="secondary" size="sm">
                      {bt.category?.name || 'General'}
                    </Badge>
                    <Badge
                      variant={
                        bt.status === 'teams_working' ? 'violet' :
                        bt.status === 'solved' ? 'success' : 'default'
                      }
                      size="sm"
                    >
                      {bt.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="heading-4 mb-3 group-hover:text-electric-lime transition-colors line-clamp-2">
                    {bt.title}
                  </h3>
                  <p className="body-md mb-4 line-clamp-3">{bt.summary}</p>

                  {bt.skills && bt.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bt.skills.slice(0, 4).map((skill) => (
                        <Badge variant="outline" size="sm" key={skill.skill_name}>
                          {skill.skill_name}
                        </Badge>
                      ))}
                      {bt.skills.length > 4 && (
                        <Badge variant="outline" size="sm">
                          +{bt.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={bt.creator?.avatar_url || undefined}
                        alt={bt.creator?.full_name || bt.creator?.username || 'User'}
                        size="xs"
                        fallback={bt.creator?.full_name || bt.creator?.username || 'User'}
                      />
                      <span className="body-sm text-muted-text">
                        {bt.creator?.full_name || bt.creator?.username || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}