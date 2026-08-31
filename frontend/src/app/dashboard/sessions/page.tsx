'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { 
  Play, 
  Clock, 
  MapPin, 
  Globe, 
  Smartphone, 
  Monitor,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import api from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

const FrustrationBadge = ({ level }: { level: number }) => {
  const label = level > 70 ? 'High' : level > 30 ? 'Medium' : 'Low';
  const colors: any = {
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[label]}`}>
      {label}
    </span>
  );
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = '6a1072fec491a8a6be8732a0';
        const res = await api.get(`/analytics/sessions?projectId=${projectId}`);
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">User Sessions</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Watch how users interact with your store.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Visitor</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Device</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Frustration</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase text-right">Replay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-zinc-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Loading real-time sessions...
                      </div>
                   </td>
                </tr>
              ) : sessions.map((session) => (
                <tr key={session._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">Visitor {session.visitorId.slice(0, 8)}</div>
                    <div className="text-xs text-zinc-500">{formatDistanceToNow(new Date(session.startTime))} ago</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.floor(session.duration / 60)}m {Math.floor(session.duration % 60)}s
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Globe className="w-3.5 h-3.5" />
                      {session.country || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {session.device === 'Desktop' ? <Monitor className="w-4 h-4 text-zinc-400" /> : <Smartphone className="w-4 h-4 text-zinc-400" />}
                  </td>
                  <td className="px-6 py-4">
                    <FrustrationBadge level={session.frustrationScore} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
