'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { alertService } from '@/services/api';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Send, 
  Save, 
  Loader2, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

interface AlertData {
  _id: string;
  type: 'ConversionDrop' | 'CheckoutError' | 'BounceRateIncrease' | 'SystemAlert';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  message: string;
  data?: any;
  isResolved: boolean;
  createdAt: string;
}

const DEMO_PROJECT_ID = '6a1072fec491a8a6be8732a0';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});

  const fetchAlerts = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    try {
      const response = await alertService.getAlerts(DEMO_PROJECT_ID);
      setAlerts(response.data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Load Discord webhook from localStorage if saved previously
    const savedWebhook = localStorage.getItem('ci_discord_webhook');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const response = await alertService.resolveAlert(id);
      setAlerts(prev => prev.map(a => a._id === id ? response.data : a));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ci_discord_webhook', webhookUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      setTestStatus({ type: 'error', message: 'Please enter a Discord Webhook URL first.' });
      return;
    }
    setTestLoading(true);
    setTestStatus(null);
    try {
      const response = await alertService.testDiscordWebhook({
        webhookUrl,
        projectId: DEMO_PROJECT_ID
      });
      setTestStatus({ type: 'success', message: response.data.message });
      // Add the newly created test alert to the list
      if (response.data.alert) {
        setAlerts(prev => [response.data.alert, ...prev]);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to send test alert';
      setTestStatus({ type: 'error', message: errMsg });
    } finally {
      setTestLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter logic
  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = 
      filter === 'all' || 
      (filter === 'active' && !alert.isResolved) || 
      (filter === 'resolved' && alert.isResolved);
    
    const severityMatch = 
      severityFilter === 'all' || 
      alert.severity === severityFilter;

    return statusMatch && severityMatch;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-900/50',
          text: 'text-red-700 dark:text-red-400',
          iconColor: 'text-red-500',
          indicator: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
          badge: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30'
        };
      case 'High':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          border: 'border-orange-200 dark:border-orange-900/50',
          text: 'text-orange-700 dark:text-orange-400',
          iconColor: 'text-orange-500',
          indicator: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]',
          badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/30'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          border: 'border-amber-200 dark:border-amber-900/50',
          text: 'text-amber-700 dark:text-amber-400',
          iconColor: 'text-amber-500',
          indicator: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
          badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-805 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30'
        };
      default: // Low
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          border: 'border-blue-200 dark:border-blue-900/50',
          text: 'text-blue-700 dark:text-blue-400',
          iconColor: 'text-blue-500',
          indicator: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
          badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30'
        };
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    const styles = getSeverityStyles(severity);
    switch (type) {
      case 'ConversionDrop':
        return <AlertOctagon className={`w-5 h-5 ${styles.iconColor}`} />;
      case 'CheckoutError':
        return <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />;
      case 'BounceRateIncrease':
        return <Bell className={`w-5 h-5 ${styles.iconColor}`} />;
      default:
        return <Info className={`w-5 h-5 ${styles.iconColor}`} />;
    }
  };

  return (
    <Shell>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Bell className="w-7 h-7" />
              </span>
              Real-Time Alerts & Anomaly Monitor
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
              Track conversion drops, system errors, and checkout glitches. Set up Discord webhooks for instant notifications.
            </p>
          </div>
          <button
            onClick={() => fetchAlerts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2">Status:</span>
                {(['all', 'active', 'resolved'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter === f 
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">🔴 Critical</option>
                  <option value="High">🟠 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🔵 Low</option>
                </select>
              </div>
            </div>

            {/* Alerts Container */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-zinc-400 text-sm mt-4">Loading system alerts...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center px-4">
                <CheckCircle2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No alerts found</h3>
                <p className="text-zinc-400 text-sm max-w-sm mt-1">
                  Everything looks normal! Select a different filter or trigger a test webhook alert on the right panel.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map(alert => {
                  const styles = getSeverityStyles(alert.severity);
                  const isExpanded = !!expandedAlerts[alert._id];
                  return (
                    <div 
                      key={alert._id} 
                      className={`relative group bg-white dark:bg-zinc-900 border rounded-2xl transition-all overflow-hidden ${
                        alert.isResolved 
                          ? 'border-zinc-150 dark:border-zinc-850 opacity-70' 
                          : `${styles.border} shadow-sm hover:shadow-md`
                      }`}
                    >
                      {/* Left indicator accent border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${alert.isResolved ? 'bg-zinc-300 dark:bg-zinc-700' : styles.indicator}`} />
                      
                      <div className="p-5 pl-7 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-2.5 rounded-xl ${alert.isResolved ? 'bg-zinc-100 dark:bg-zinc-800/50' : styles.bg}`}>
                          {getAlertIcon(alert.type, alert.severity)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className={`font-bold text-base leading-tight ${alert.isResolved ? 'text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                              {alert.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-md border ${alert.isResolved ? 'bg-zinc-50 border-zinc-200 text-zinc-400 dark:bg-zinc-900' : styles.badge}`}>
                                {alert.severity}
                              </span>
                              {alert.isResolved && (
                                <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-md bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30">
                                  Resolved
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm leading-relaxed ${alert.isResolved ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-600 dark:text-zinc-300'}`}>
                            {alert.message}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-zinc-400 font-medium">
                              {new Date(alert.createdAt).toLocaleString()}
                            </span>

                            <div className="flex items-center gap-3">
                              {alert.data && (
                                <button 
                                  onClick={() => toggleExpand(alert._id)}
                                  className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                                >
                                  {isExpanded ? (
                                    <>Less Details <ChevronUp className="w-3.5 h-3.5" /></>
                                  ) : (
                                    <>More Details <ChevronDown className="w-3.5 h-3.5" /></>
                                  )}
                                </button>
                              )}

                              {!alert.isResolved && (
                                <button
                                  onClick={() => handleResolve(alert._id)}
                                  className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-900/30 transition-all hover:scale-[1.03] active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Resolve
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expandable JSON details */}
                      {isExpanded && alert.data && (
                        <div className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 p-5 pl-7 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
                          <div className="text-zinc-400 mb-2 font-sans font-semibold uppercase tracking-wider text-[10px]">Context Payload</div>
                          <pre>{JSON.stringify(alert.data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Integration Sidebar Panel */}
          <div className="space-y-6">
            {/* Discord Configuration Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              {/* Background abstract art */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                <Bell className="w-64 h-64" />
              </div>

              <h2 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
                Discord Integration
              </h2>
              <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                Receive real-time alerts directly in your team's Discord channel. Simple setup using Discord's official Webhook feature.
              </p>

              <form onSubmit={handleSaveWebhook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
                    Discord Webhook URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-indigo-950/40 border border-indigo-400/40 focus:border-white rounded-xl px-4 py-3 text-xs outline-none transition-all text-white placeholder-indigo-300/60"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save URL
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-950/40 hover:bg-indigo-950/60 text-white border border-indigo-400/40 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50"
                  >
                    {testLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send Test Alert
                  </button>
                </div>
              </form>

              {testStatus && (
                <div className={`mt-4 p-3 rounded-xl text-xs leading-relaxed font-semibold ${
                  testStatus.type === 'success' 
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}>
                  {testStatus.message}
                </div>
              )}
            </div>

            {/* Setup Guide Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <span>📖</span> Setup Guide
              </h3>
              <ol className="text-xs text-zinc-500 dark:text-zinc-400 space-y-4 list-decimal list-inside">
                <li>
                  Open <span className="font-semibold text-zinc-800 dark:text-zinc-200">Discord</span> and go to your server settings.
                </li>
                <li>
                  Select the <span className="font-semibold text-zinc-800 dark:text-zinc-200">Integrations</span> tab.
                </li>
                <li>
                  Click <span className="font-semibold text-zinc-800 dark:text-zinc-200">Webhooks</span> &rarr; <span className="font-semibold text-zinc-800 dark:text-zinc-200">Create Webhook</span>.
                </li>
                <li>
                  Choose the channel where notifications should be routed.
                </li>
                <li>
                  Click <span className="font-semibold text-zinc-800 dark:text-zinc-200">Copy Webhook URL</span> and paste it above!
                </li>
              </ol>
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <a 
                  href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5 justify-center"
                >
                  Official Discord Guide
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
