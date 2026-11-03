import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { BTDetailPage } from '@/pages/BTDetailPage';
import { SubmitBTPage } from '@/pages/SubmitBTPage';
import { MainLayout } from '@/components/layout/Layout';

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/bt/:slug" element={<BTDetailPage />} />
        <Route path="/submit" element={<SubmitBTPage />} />
      </Routes>
    </MainLayout>
  );
}