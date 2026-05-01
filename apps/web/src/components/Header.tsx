'use client';
import {
  Bell, Search, Sun, Moon, LogOut, User, Settings, ChevronDown,
  Menu, X, Server, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'warning', title: 'SSL Expiring', message: 'example.com SSL expires in 7 days', time: '2h ago', read: false },
  { id: '2', type: 'info', title: 'Backup Complete', message: 'Daily backup completed successfully', time: '5h ago', read: false },
  { id: '3', type: 'success', title: 'Update Available', message: 'HostPanel Pro v1.0.1 available', time: '1d ago', read: true },
  { id: '4', type: 'danger', title: 'Disk Warning', message: 'Disk usage at 85%', time: '2d ago', read: true },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-panel-800 border-b border-panel-200 dark:border-panel-700">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Breadcrumb / Search */}
        <div className="flex items-center gap-4 flex-1">
          {!mobileSearch ? (
            <div className="hidden md:flex items-center gap-2 text-sm text-panel-500 dark:text-panel-400">
              <Server className="w-4 h-4" />
              <span className="text-panel-700 dark:text-panel-300 font-medium">
                {user?.name || 'Admin'}
              </span>
              <span>/</span>
              <span>Dashboard</span>
            </div>
          ) : (
            <div className="flex-1 max-w-md animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-400" />
                <input
                  type="text"
                  placeholder="Search domains, sites, settings..."
                  className="input pl-10 py-1.5 text-sm"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Escape') setMobileSearch(false); }}
                />
                <button onClick={() => setMobileSearch(false)} className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden">
                  <X className="w-4 h-4 text-panel-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search toggle (mobile) */}
          <button
            onClick={() => setMobileSearch(!mobileSearch)}
            className="p-2 rounded-lg text-panel-500 dark:text-panel-400 hover:bg-panel-100 dark:hover:bg-panel-700 md:hidden"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Search (desktop) */}
          <div className="hidden md:block relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-panel-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-panel-200 dark:border-panel-700 bg-panel-50 dark:bg-panel-900 text-sm text-panel-800 dark:text-panel-200 placeholder-panel-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-panel-500 dark:text-panel-400 hover:bg-panel-100 dark:hover:bg-panel-700"
            title="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg text-panel-500 dark:text-panel-400 hover:bg-panel-100 dark:hover:bg-panel-700 relative"
            >
              <Bell className="w-5 h-5" />
              {mockNotifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-panel-800" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 card animate-fade-in z-50 max-h-96 overflow-y-auto">
                <div className="card-header flex items-center justify-between">
                  <span>Notifications</span>
                  <button className="text-xs text-accent hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-panel-200 dark:divide-panel-700">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className={cn('p-3 hover:bg-panel-50 dark:hover:bg-panel-700/50 cursor-pointer', !n.read && 'bg-accent/5 dark:bg-accent/10')}>
                      <div className="flex items-start gap-3">
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />}
                        {n.type === 'danger' && <ShieldCheck className="w-4 h-4 text-danger mt-0.5" />}
                        {n.type === 'info' && <Bell className="w-4 h-4 text-accent mt-0.5" />}
                        {n.type === 'success' && <Bell className="w-4 h-4 text-success mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-panel-800 dark:text-panel-200">{n.title}</p>
                          <p className="text-xs text-panel-500 dark:text-panel-400 truncate">{n.message}</p>
                          <p className="text-[10px] text-panel-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-panel-100 dark:hover:bg-panel-700 ml-1"
            >
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm">
                {(user?.name || 'A')[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-panel-700 dark:text-panel-300">
                {user?.name || 'Admin'}
              </span>
              <ChevronDown className="hidden md:block w-4 h-4 text-panel-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 card animate-fade-in z-50">
                <div className="p-3 border-b border-panel-200 dark:border-panel-700">
                  <p className="text-sm font-medium text-panel-800 dark:text-panel-200">{user?.name}</p>
                  <p className="text-xs text-panel-500">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent dark:bg-accent/20">
                    {user?.role || 'Superadmin'}
                  </span>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-panel-700 dark:text-panel-300 hover:bg-panel-50 dark:hover:bg-panel-700 rounded-lg"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-panel-700 dark:text-panel-300 hover:bg-panel-50 dark:hover:bg-panel-700 rounded-lg"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); toast.success('Signed out'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}