'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Globe, Wordpress, FolderOpen, Database, Mail,
  ShieldCheck, Shield, Bug, HardDrive, Gauge, Activity,
  FileText, Clock, GitBranch, Container, Users, UserCog,
  Layers, CreditCard, Wrench, Puzzle, Settings, RefreshCw,
  History, ChevronLeft, ChevronRight, Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const menuSections: MenuSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Web Services',
    items: [
      { label: 'Websites & Domains', href: '/websites', icon: Globe },
      { label: 'WordPress', href: '/wordpress', icon: Wordpress },
      { label: 'Files', href: '/files', icon: FolderOpen },
      { label: 'Databases', href: '/databases', icon: Database },
      { label: 'Email', href: '/email', icon: Mail },
      { label: 'DNS', href: '/dns', icon: Server },
      { label: 'SSL / TLS', href: '/ssl', icon: ShieldCheck },
      { label: 'FTP / SFTP', href: '/ftp', icon: HardDrive },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Security Center', href: '/security', icon: Shield },
      { label: 'Antivirus & Malware', href: '/antivirus', icon: Bug },
      { label: 'Firewall & Fail2Ban', href: '/firewall', icon: ShieldCheck },
    ],
  },
  {
    label: 'Backups & Performance',
    items: [
      { label: 'Backups', href: '/backups', icon: HardDrive },
      { label: 'Performance & Cache', href: '/performance', icon: Gauge },
    ],
  },
  {
    label: 'Monitoring & Logs',
    items: [
      { label: 'Monitoring', href: '/monitoring', icon: Activity },
      { label: 'Logs', href: '/logs', icon: FileText },
      { label: 'Cron Jobs', href: '/cron', icon: Clock },
    ],
  },
  {
    label: 'Development',
    items: [
      { label: 'Git & Deployments', href: '/git', icon: GitBranch },
      { label: 'Docker & Apps', href: '/docker', icon: Container },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Clients', href: '/clients', icon: Users },
      { label: 'Users', href: '/users', icon: UserCog },
      { label: 'Hosting Plans', href: '/plans', icon: Layers },
      { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Server Tools', href: '/server', icon: Wrench },
      { label: 'Extensions', href: '/extensions', icon: Puzzle },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Updates', href: '/updates', icon: RefreshCw },
      { label: 'Audit Log', href: '/audit', icon: History },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-panel-800 dark:bg-panel-950 border-r border-panel-700 dark:border-panel-800 transition-all duration-200 flex flex-col',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-panel-700 dark:border-panel-800',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg">
            HostPanel <span className="text-accent">Pro</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin">
        {menuSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase text-panel-400 dark:text-panel-500 px-3 py-2 tracking-wider">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2.5 mb-0.5 text-sm transition-colors group relative',
                    isActive
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-panel-300 dark:text-panel-400 hover:bg-panel-700/50 dark:hover:bg-panel-800/80 hover:text-white',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed ? '' : 'mr-3')} />
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-accent rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-panel-700 dark:border-panel-800 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-panel-400 hover:text-white hover:bg-panel-700/50 dark:hover:bg-panel-800/80 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}