'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Info, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#94a3b8', '#cbd5e1', '#e2e8f0'];

export default function FunnelsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = '6a1072fec491a8a6be8732a0';
        const res = await axios.get(`http://localhost:5001/api/analytics/funnel?projectId=${projectId}`);
        setData(res.data);
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
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Conversion Funnel</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Live journey analysis from the latest simulation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-8">Purchase Journey</h3>
            <div className="h-[400px] flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis dataKey="step" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 opacity-80" />
                <h4 className="font-semibold">AI Funnel Insight</h4>
              </div>
              <p className="text-indigo-50 text-sm leading-relaxed">
                The simulation shows that only **{(data[data.length-1]?.count / data[0]?.count * 100 || 0).toFixed(1)}%** of landing users reach checkout.
                The biggest drop occurs at the **Add to Cart** stage. Consider optimizing product page loading speeds.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Drop-off Bottlenecks
              </h4>
              <div className="space-y-4">
                {data.filter(f => f.drop > 50).map((step, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{step.step}</span>
                    <span className="text-sm font-bold text-red-600">-{step.drop}%</span>
                  </div>
                ))}
                {!loading && data.filter(f => f.drop > 50).length === 0 && (
                   <p className="text-sm text-zinc-500 italic">No major bottlenecks detected in current flow.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
