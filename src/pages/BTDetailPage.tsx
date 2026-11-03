import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BT, Discussion, Team, ResearchReference } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { MessageSquare, Users, BookOpen, ChevronRight, Bookmark } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export function BTDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bt, setBt] = useState<BT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBT();
  }, [slug]);

  const fetchBT = async () => {
    try {
      const { data, error } = await supabase
        .from('bts')
        .select(`
          *,
          category:categories(*),
          creator:profiles(*),
          skills:bt_skills(skill_name),
          references:bt_references(reference:research_references(*))
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setBt(data);
    } catch (error) {
      console.error('Error fetching BT:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="section-container py-24 text-center">Loading...</div>;
  if (!bt) return <div className="section-container py-24 text-center">Problem not found.</div>;

  return (
    <div className="section-container py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">{bt.category?.name}</Badge>
          <Badge variant={bt.status === 'teams_working' ? 'violet' : 'default'}>{bt.status.replace('_', ' ')}</Badge>
        </div>
        <h1 className="heading-1 mb-4">{bt.title}</h1>
        <div className="flex items-center gap-4 text-muted-text">
          <div className="flex items-center gap-2">
            <Avatar size="sm" src={bt.creator?.avatar_url || undefined} fallback={bt.creator?.full_name || 'User'} />
            <span>{bt.creator?.full_name}</span>
          </div>
          <span>•</span>
          <span>Updated {formatRelativeTime(bt.updated_at)}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader><CardTitle>Problem Description</CardTitle></CardHeader>
            <CardContent className="body-md space-y-4">
              <p>{bt.description}</p>
              <h4 className="font-semibold text-warm-off-white">Why it matters:</h4>
              <p>{bt.importance}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Discussion</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-text">Discussion functionality coming soon.</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button className="w-full">Follow Problem</Button>
              <Button variant="secondary" className="w-full">Request to Join Team</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bt.skills?.map((s) => (
                  <Badge variant="outline" key={s.skill_name}>{s.skill_name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Research References</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {bt.references?.map((r: any) => (
                <a key={r.reference.id} href={r.reference.source_url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="font-medium text-warm-off-white group-hover:text-electric-lime">{r.reference.title}</div>
                  <div className="text-sm text-muted-text">{r.reference.authors.join(', ')}</div>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}