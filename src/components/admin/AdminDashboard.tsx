'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Menu as MenuIcon,
  Mail,
  LogOut,
  ChevronRight,
  Loader2,
  Users,
  FileText,
  Settings,
  Home,
  BarChart3,
  FolderOpen,
  Image
} from 'lucide-react';
import MenuManagement from './MenuManagement';
import ContactManagement from './ContactManagement';
import SurveyManagement from './SurveyManagement';
import ReportsManagement from './ReportsManagement';
import HeroSliderManagement from './HeroSliderManagement';
import PejabatManagement from './PejabatManagement';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

type AdminView = 'dashboard' | 'menu' | 'hero' | 'pejabat' | 'kontak' | 'survey' | 'reports';

interface AdminDashboardProps {
  initialView?: AdminView;
}

export default function AdminDashboard({ initialView }: AdminDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine current view from pathname
  const getCurrentView = (): AdminView => {
    if (initialView) return initialView;
    if (pathname === '/admin/menu') return 'menu';
    if (pathname === '/admin/hero') return 'hero';
    if (pathname === '/admin/pejabat') return 'pejabat';
    if (pathname === '/admin/kontak') return 'kontak';
    if (pathname === '/admin/survey') return 'survey';
    if (pathname.startsWith('/admin/reports')) return 'reports';
    return 'dashboard';
  };

  const currentView = getCurrentView();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setLoading(false);
            return;
          }
        }
        
        // If not authenticated, middleware will redirect
        // But we also redirect here as fallback
        window.location.href = '/login';
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      // Hard redirect to ensure cookies are cleared
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'hero' as AdminView, label: 'Hero Slider', icon: Image, href: '/admin/hero' },
    { id: 'pejabat' as AdminView, label: 'Profil Pejabat', icon: Users, href: '/admin/pejabat' },
    { id: 'menu' as AdminView, label: 'Menu', icon: MenuIcon, href: '/admin/menu' },
    { id: 'reports' as AdminView, label: 'Data Laporan', icon: FolderOpen, href: '/admin/reports' },
    { id: 'kontak' as AdminView, label: 'Kontak', icon: Mail, href: '/admin/kontak' },
    { id: 'survey' as AdminView, label: 'Survey', icon: BarChart3, href: '/admin/survey' },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8B0000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Admin Panel</h1>
              <p className="text-xs text-gray-500">PN Nanga Bulik</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#8B0000] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-4 py-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800 truncate">{user.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600"
              onClick={() => router.push('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Lihat Website
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'menu' && 'Manajemen Menu'}
            {currentView === 'reports' && 'Manajemen Data Laporan'}
            {currentView === 'kontak' && 'Manajemen Kontak'}
            {currentView === 'survey' && 'Manajemen Survey'}
          </h2>
        </header>

        {/* Content */}
        <div className="p-8">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Menu
                    </CardTitle>
                    <MenuIcon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">8</div>
                    <p className="text-xs text-gray-500 mt-1">Menu aktif</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Artikel
                    </CardTitle>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">24</div>
                    <p className="text-xs text-gray-500 mt-1">Dari WordPress</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Data Survey
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">4</div>
                    <p className="text-xs text-gray-500 mt-1">Kategori survey</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Pengguna
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">1</div>
                    <p className="text-xs text-gray-500 mt-1">Admin aktif</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                  <CardDescription>Akses cepat ke fitur utama</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Link href="/admin/menu">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex-col gap-2"
                      >
                        <MenuIcon className="h-5 w-5" />
                        <span className="text-sm">Kelola Menu</span>
                      </Button>
                    </Link>
                    <Link href="/admin/kontak">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex-col gap-2"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="text-sm">Kelola Kontak</span>
                      </Button>
                    </Link>
                    <Link href="/admin/survey">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex-col gap-2"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-sm">Kelola Survey</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.open('https://web.pn-nangabulik.go.id/wp-admin', '_blank')}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-sm">WordPress Admin</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => router.push('/')}
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-sm">Lihat Website</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Welcome Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selamat Datang!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Selamat datang di panel admin Pengadilan Negeri Nanga Bulik.
                    Gunakan menu di sidebar untuk mengelola konten website.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === 'menu' && <MenuManagement />}

          {currentView === 'hero' && <HeroSliderManagement />}

          {currentView === 'pejabat' && <PejabatManagement />}

          {currentView === 'reports' && <ReportsManagement />}

          {currentView === 'kontak' && <ContactManagement />}

          {currentView === 'survey' && <SurveyManagement />}
        </div>
      </main>
    </div>
  );
}

// Shield icon component
function Shield({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
