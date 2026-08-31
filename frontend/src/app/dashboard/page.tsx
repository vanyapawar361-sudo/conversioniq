'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { 
  Users, 
  ShoppingBag, 
  MousePointerClick, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import api from '@/services/api';

const StatCard = ({ title, value, change, icon: Icon, color, isLoading }: any) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={statContainerCn(color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={cn("flex items-center gap-1 text-xs font-medium", change >= 0 ? "text-green-600" : "text-red-600")}>
        {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(change)}%
      </div>
    </div>
    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
    {isLoading ? (
      <Loader2 className="w-6 h-6 animate-spin text-zinc-300 mt-1" />
    ) : (
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{value}</h3>
    )}
  </div>
);

function statContainerCn(color: string) {
  const base = "p-2 rounded-xl";
  if (color === 'indigo') return `${base} bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400`;
  if (color === 'green') return `${base} bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400`;
  if (color === 'orange') return `${base} bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400`;
  if (color === 'purple') return `${base} bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400`;
  return base;
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = '6a1072fec491a8a6be8732a0'; // Demo Project ID
        const res = await api.get(`/analytics/overview?projectId=${projectId}`);
        setStats(res.data);
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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Welcome back, Admin</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Here's the live data from your EcoStore simulation.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Project</p>
            <p className="text-sm font-semibold text-indigo-600">Main Storefront</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Visitors" value={stats?.totalVisitors} change={12.5} icon={Users} color="indigo" isLoading={loading} />
          <StatCard title="Conversion Rate" value={stats?.conversionRate} change={-0.8} icon={ShoppingBag} color="green" isLoading={loading} />
          <StatCard title="Abandoned Carts" value={stats?.abandonedCarts} change={-15} icon={MousePointerClick} color="orange" isLoading={loading} />
          <StatCard title="Revenue Loss" value={stats?.revenueLoss} change={5.2} icon={Clock} color="purple" isLoading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Visitor Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.trends || []}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Device Breakdown</h3>
            <div className="h-[300px] flex items-end justify-between px-6 pb-2">
               {/* Mock bars for device breakdown for now */}
               <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-indigo-600 rounded-t-lg" style={{height: '180px'}}></div>
                  <span className="text-xs font-bold text-zinc-400 uppercase">Desktop</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-indigo-400 rounded-t-lg" style={{height: '120px'}}></div>
                  <span className="text-xs font-bold text-zinc-400 uppercase">Mobile</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-indigo-200 rounded-t-lg" style={{height: '40px'}}></div>
                  <span className="text-xs font-bold text-zinc-400 uppercase">Tablet</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
