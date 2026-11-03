import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={className}>
      <Header />
      <main className="pt-16 min-h-screen" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={className}>
      <Header />
      <main className="pt-16 min-h-screen flex items-center justify-center px-4 py-12" id="main-content">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className={className}>
      <Header />
      <div className="pt-16 min-h-screen bg-gray-950">
        <div className="section-container py-8">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={className}>
      <Header />
      <div className="pt-16 min-h-screen">
        <div className="section-container py-8">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}