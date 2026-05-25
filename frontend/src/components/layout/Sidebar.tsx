'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MousePointer2, 
  BarChart3, 
  PlayCircle, 
  Settings, 
  Layers, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Funnels', href: '/dashboard/funnels', icon: Layers },
  { name: 'Heatmaps', href: '/dashboard/heatmaps', icon: MousePointer2 },
  { name: 'Sessions', href: '/dashboard/sessions', icon: PlayCircle },
  { name: 'Insights', href: '/dashboard/insights', icon: Zap },
  { name: 'Alerts', href: '/dashboard/alerts', icon: AlertCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">ConversionIQ</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href 
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400" 
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">VP</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Vanya Pawar</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
