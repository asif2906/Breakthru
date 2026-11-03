import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { slugify } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function SubmitBTPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    importance: '',
    category_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('bts')
        .insert([{
          ...formData,
          slug: slugify(formData.title),
          creator_id: user.id,
          review_status: 'submitted',
        }])
        .select()
        .single();

      if (error) throw error;
      navigate(`/bt/${data.slug}`);
    } catch (error) {
      console.error('Error submitting BT:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Drop a BT</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <Input label="Short Summary" required value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} />
            <Textarea label="Full Description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <Textarea label="Why it matters" required value={formData.importance} onChange={(e) => setFormData({...formData, importance: e.target.value})} />
            <Select
              label="Category"
              required
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              options={[{ value: '1', label: 'Artificial Intelligence' }, { value: '2', label: 'Energy' }]}
            />
            <Button type="submit" isLoading={loading}>Submit for Review</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}