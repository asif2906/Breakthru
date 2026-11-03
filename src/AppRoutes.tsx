import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { BTDetailPage } from '@/pages/BTDetailPage';
import { SubmitBTPage } from '@/pages/SubmitBTPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { TeamsPage } from '@/pages/TeamsPage';
import { BreakthroughsPage } from '@/pages/BreakthroughsPage';
import { ResearchPage } from '@/pages/ResearchPage';
import { MainLayout } from '@/components/layout/Layout';

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/bt/:slug" element={<BTDetailPage />} />
        <Route path="/submit" element={<SubmitBTPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/breakthroughs" element={<BreakthroughsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/mission" element={<LandingPage />} />
        <Route path="/blog" element={<LandingPage />} />
        <Route path="/careers" element={<LandingPage />} />
        <Route path="/press" element={<LandingPage />} />
        <Route path="/docs" element={<LandingPage />} />
        <Route path="/api" element={<LandingPage />} />
        <Route path="/guidelines" element={<LandingPage />} />
        <Route path="/help" element={<LandingPage />} />
        <Route path="/status" element={<LandingPage />} />
        <Route path="/privacy" element={<LandingPage />} />
        <Route path="/terms" element={<LandingPage />} />
        <Route path="/cookies" element={<LandingPage />} />
        <Route path="/security" element={<LandingPage />} />
        <Route path="/data-requests" element={<LandingPage />} />
      </Routes>
    </MainLayout>
  );
}