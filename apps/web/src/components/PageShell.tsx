'use client';
import {
  Globe, Wordpress, FolderOpen, Database, Mail, Server, ShieldCheck,
  HardDrive, Shield, Bug, Gauge, Activity, FileText, Clock,
  GitBranch, Container, Users, UserCog, Layers, CreditCard,
  Wrench, Puzzle, Settings, RefreshCw, History
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Globe, Wordpress, FolderOpen, Database, Mail, Server, ShieldCheck,
  HardDrive, Shield, Bug, Gauge, Activity, FileText, Clock,
  GitBranch, Container, Users, UserCog, Layers, CreditCard,
  Wrench, Puzzle, Settings, RefreshCw, History,
};

interface PageShellProps {
  title: string;
  description?: string;
  icon?: string;
  children: React.ReactNode;
}

export default function PageShell({ title, description, icon, children }: PageShellProps) {
  const IconComp = icon ? iconMap[icon] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start gap-4">
        {IconComp && (
          <div className="p-2.5 rounded-xl bg-accent/10 dark:bg-accent/20 flex-shrink-0">
            <IconComp className="w-6 h-6 text-accent" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-panel-900 dark:text-white">{title}</h1>
          {description && (
            <p className="text-sm text-panel-500 dark:text-panel-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}