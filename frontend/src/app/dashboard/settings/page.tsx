'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { projectService } from '@/services/api';
import { 
  Settings, 
  Globe, 
  Code, 
  Copy, 
  Check, 
  Trash2, 
  Save, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface ProjectDetails {
  _id: string;
  name: string;
  domain: string;
  trackingId: string;
}

const DEMO_PROJECT_ID = '6a1072fec491a8a6be8732a0';

export default function SettingsPage() {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'web' | 'flutter'>('web');
  const [copiedText, setCopiedText] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectDetails(DEMO_PROJECT_ID);
        setProject(response.data);
        setName(response.data.name);
        setDomain(response.data.domain);
      } catch (err) {
        console.error('Failed to fetch project details:', err);
        // Load fallback details for mock if endpoint doesn't return
        const fallback = {
          _id: DEMO_PROJECT_ID,
          name: 'EcoStore Demo',
          domain: 'ecostore.example.com',
          trackingId: 'c1072fe-c491-a8a6-be87-32a0d9e8712a'
        };
        setProject(fallback);
        setName(fallback.name);
        setDomain(fallback.domain);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await projectService.updateProject(DEMO_PROJECT_ID, { name, domain });
      setProject(response.data);
      setName(response.data.name);
      setDomain(response.data.domain);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getWebSnippet = () => {
    const tid = project?.trackingId || 'YOUR-TRACKING-ID';
    return `<!-- ConversionIQ Tracking Tag -->
<script>
  (function(w,d,s,l,i){
    w.ci=w.ci||function(){(w.ci.q=w.ci.q||[]).push(arguments)};
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s);
    j.async=true;j.src='http://localhost:5002/tracking.js';
    j.setAttribute('data-project-id',i);
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','ci','${tid}');
</script>
<!-- End ConversionIQ Tracking Tag -->`;
  };

  const getFlutterSnippet = () => {
    const tid = project?.trackingId || 'YOUR-TRACKING-ID';
    return `import 'package:conversion_iq/conversion_iq.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ConversionIQ.initialize(
    projectId: '${tid}',
    apiEndpoint: 'http://localhost:5002/api',
  );
  runApp(const MyApp());
}`;
  };

  return (
    <Shell>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Settings className="w-7 h-7" />
            </span>
            Project Settings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Manage your project configurations, access tracking credentials, and integrate the telemetry SDKs.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-zinc-400 text-sm mt-4">Loading project settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - General settings & Danger zone */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* General Project Config Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  General Details
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My E-Commerce Store"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                      Target Domain
                    </label>
                    <input
                      type="text"
                      required
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e.g. my-store.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                      Project Tracking ID
                    </label>
                    <div className="bg-zinc-100 dark:bg-zinc-950/60 font-mono text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 select-all">
                      {project?.trackingId}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Settings Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/40 rounded-3xl p-6">
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Danger Zone
                </h2>
                <p className="text-xs text-red-650 dark:text-red-400/80 leading-relaxed mb-4">
                  Deleting this project will permanently remove all analytical insights, funnels, heatmaps, and sessions. This is irreversible.
                </p>

                {deleteConfirm ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Are you absolutely sure?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-zinc-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert('Project deletion simulation: Done!');
                          setDeleteConfirm(false);
                        }}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-750 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Yes, Delete Project
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/30 hover:bg-red-100/40 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-bold text-sm py-2.5 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </button>
                )}
              </div>

            </div>

            {/* Right Column - Snippets & Installation Code */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Setup Code Snippets Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-500" />
                    SDK Integration Snippets
                  </h2>
                  <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('web')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'web' 
                          ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Web Tag (JS)
                    </button>
                    <button
                      onClick={() => setActiveTab('flutter')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'flutter' 
                          ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      <span>📱</span>
                      Flutter (Dart)
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeTab === 'web' ? (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                        To start recording sessions, heatmaps, and funnel analytics on your website, copy and paste this script directly inside the <span className="font-mono bg-zinc-100 dark:bg-zinc-950 px-1 py-0.5 rounded text-indigo-600">&lt;head&gt;</span> tag.
                      </p>
                      <div className="relative group bg-zinc-950 text-zinc-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto border border-zinc-900">
                        <button
                          onClick={() => copyToClipboard(getWebSnippet())}
                          className="absolute right-3 top-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 p-1.5 rounded-lg text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Copy snippet"
                        >
                          {copiedText ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <pre className="pr-8">{getWebSnippet()}</pre>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                        Initialize telemetry inside your Flutter application's main entry point. Be sure to import the SDK and boot it before executing <span className="font-mono bg-zinc-100 dark:bg-zinc-950 px-1 py-0.5 rounded text-indigo-600">runApp</span>.
                      </p>
                      <div className="relative group bg-zinc-950 text-zinc-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto border border-zinc-900">
                        <button
                          onClick={() => copyToClipboard(getFlutterSnippet())}
                          className="absolute right-3 top-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 p-1.5 rounded-lg text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Copy snippet"
                        >
                          {copiedText ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <pre className="pr-8">{getFlutterSnippet()}</pre>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Need custom integration details? Check the telemetry integration guides.
                    </p>
                    <a 
                      href="https://github.com/vanyapawar361-sudo/conversioniq-docs" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      Developer SDK Docs
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
