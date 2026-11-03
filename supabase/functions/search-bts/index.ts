import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  query?: string;
  category?: string;
  skills?: string[];
  status?: string;
  sort?: 'newest' | 'recently_active' | 'most_followed' | 'most_discussed';
  page?: number;
  page_size?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const url = new URL(req.url);
    const params: SearchParams = {
      query: url.searchParams.get('query') || undefined,
      category: url.searchParams.get('category') || undefined,
      skills: url.searchParams.get('skills')?.split(',').filter(Boolean) || undefined,
      status: url.searchParams.get('status') || undefined,
      sort: (url.searchParams.get('sort') as SearchParams['sort']) || 'newest',
      page: parseInt(url.searchParams.get('page') || '1'),
      page_size: Math.min(parseInt(url.searchParams.get('page_size') || '12'), 50),
    };

    let query = supabase
      .from('bts')
      .select(`
        *,
        category:categories(*),
        creator:profiles(*),
        skills:bt_skills(skill_name),
        _follower_count:bt_followers(count),
        _team_count:teams(count)
      `, { count: 'exact' })
      .eq('review_status', 'approved');

    // Text search
    if (params.query) {
      query = query.textSearch('search_vector', params.query, {
        type: 'websearch',
        config: 'english',
      });
    }

    // Category filter
    if (params.category) {
      query = query.eq('category.slug', params.category);
    }

    // Skills filter
    if (params.skills && params.skills.length > 0) {
      query = query.in('skills.skill_name', params.skills);
    }

    // Status filter
    if (params.status) {
      query = query.eq('status', params.status);
    }

    // Sorting
    switch (params.sort) {
      case 'recently_active':
        query = query.order('updated_at', { ascending: false });
        break;
      case 'most_followed':
        query = query.order('_follower_count', { ascending: false, foreignTable: 'bt_followers' });
        break;
      case 'most_discussed':
        query = query.order('created_at', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Pagination
    const from = (params.page - 1) * params.page_size;
    const to = from + params.page_size - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({
        data: data || [],
        count: count || 0,
        page: params.page,
        page_size: params.page_size,
        has_more: (count || 0) > to + 1,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});