'use client';

import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { 
  Laptop, 
  Smartphone, 
  Tablet as TabletIcon, 
  MousePointer2, 
  Eye, 
  RefreshCw, 
  Map, 
  ChevronDown, 
  TrendingUp, 
  Info,
  Flame,
  MousePointerClick
} from 'lucide-react';

const PAGES = [
  { path: '/', name: 'Homepage (/)', clicks: 843, scrollDepth: '78%' },
  { path: '/products/premium-headphones', name: 'Product Page (/products/premium-headphones)', clicks: 1205, scrollDepth: '62%' },
  { path: '/checkout', name: 'Checkout Page (/checkout)', clicks: 310, scrollDepth: '95%' }
];

const DEVICES = [
  { id: 'Desktop', name: 'Desktop', icon: Laptop, dimensions: 'w-full max-w-4xl h-[550px]' },
  { id: 'Tablet', name: 'Tablet', icon: TabletIcon, dimensions: 'w-[560px] h-[650px]' },
  { id: 'Mobile', name: 'Mobile', icon: Smartphone, dimensions: 'w-[360px] h-[600px]' }
];

// Mock hot spots (relative coordinates on the mockup grid)
interface Hotspot {
  x: number; // percentage from left
  y: number; // percentage from top
  radius: number; // visual circle size in pixels
  clicks: number;
  label: string;
  intensity: 'high' | 'medium' | 'low';
}

const HOTSPOTS_DATA: Record<string, Record<string, Hotspot[]>> = {
  '/': {
    Desktop: [
      { x: 30, y: 45, radius: 45, clicks: 342, label: 'Hero CTA: "Shop Now"', intensity: 'high' },
      { x: 75, y: 12, radius: 25, clicks: 104, label: 'Top Nav: "Products"', intensity: 'medium' },
      { x: 50, y: 82, radius: 30, clicks: 92, label: 'Featured Product: Premium Headphones', intensity: 'medium' },
      { x: 88, y: 12, radius: 20, clicks: 45, label: 'Cart Header Icon', intensity: 'low' },
    ],
    Tablet: [
      { x: 50, y: 48, radius: 40, clicks: 122, label: 'Hero CTA: "Shop Now"', intensity: 'high' },
      { x: 50, y: 85, radius: 35, clicks: 68, label: 'Featured Product Card', intensity: 'medium' },
      { x: 92, y: 8, radius: 22, clicks: 31, label: 'Mobile Menu Hamburger', intensity: 'low' }
    ],
    Mobile: [
      { x: 50, y: 52, radius: 42, clicks: 215, label: 'Hero CTA: "Shop Now"', intensity: 'high' },
      { x: 50, y: 88, radius: 38, clicks: 145, label: 'Featured Product Click', intensity: 'high' },
      { x: 90, y: 6, radius: 25, clicks: 52, label: 'Hamburger Menu Toggle', intensity: 'medium' }
    ]
  },
  '/products/premium-headphones': {
    Desktop: [
      { x: 68, y: 55, radius: 50, clicks: 480, label: '"Add to Cart" Button', intensity: 'high' },
      { x: 30, y: 40, radius: 35, clicks: 252, label: 'Product Image Main (Zoom)', intensity: 'medium' },
      { x: 68, y: 70, radius: 25, clicks: 95, label: 'Warranty Dropdown Selector', intensity: 'low' },
      { x: 25, y: 88, radius: 20, clicks: 65, label: 'Thumbnail Image #2', intensity: 'low' },
    ],
    Tablet: [
      { x: 50, y: 72, radius: 45, clicks: 185, label: '"Add to Cart" Button', intensity: 'high' },
      { x: 50, y: 35, radius: 40, clicks: 142, label: 'Product Gallery Swipe', intensity: 'medium' },
      { x: 18, y: 92, radius: 25, clicks: 51, label: 'Review Stars Rating link', intensity: 'low' }
    ],
    Mobile: [
      { x: 50, y: 38, radius: 60, clicks: 345, label: 'Product Image (Rage Click hotspot on iOS Safari)', intensity: 'high' },
      { x: 50, y: 78, radius: 50, clicks: 312, label: '"Add to Cart" Button (Sticky UI)', intensity: 'high' },
      { x: 88, y: 15, radius: 30, clicks: 98, label: 'Wishlist Heart Icon', intensity: 'medium' }
    ]
  },
  '/checkout': {
    Desktop: [
      { x: 32, y: 82, radius: 48, clicks: 145, label: '"Place Order" Button', intensity: 'high' },
      { x: 68, y: 28, radius: 35, clicks: 98, label: '"Apply Coupon Code" Field', intensity: 'medium' },
      { x: 32, y: 25, radius: 15, clicks: 42, label: 'Guest Checkout Selection', intensity: 'low' },
    ],
    Tablet: [
      { x: 50, y: 88, radius: 42, clicks: 68, label: '"Place Order" Button', intensity: 'high' },
      { x: 50, y: 42, radius: 28, clicks: 41, label: '"Apply Coupon Code" Button', intensity: 'medium' }
    ],
    Mobile: [
      { x: 50, y: 85, radius: 45, clicks: 128, label: '"Place Order" Button (Sticky bottom)', intensity: 'high' },
      { x: 82, y: 22, radius: 32, clicks: 88, label: 'Coupon Input Field Dropdown', intensity: 'medium' },
      { x: 15, y: 12, radius: 20, clicks: 35, label: '"Back to Cart" Arrow Link', intensity: 'low' }
    ]
  }
};

export default function HeatmapsPage() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0]);
  const [selectedDevice, setSelectedDevice] = useState('Desktop');
  const [showOverlay, setShowOverlay] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const activeDeviceData = DEVICES.find(d => d.id === selectedDevice) || DEVICES[0];
  const hotspots = HOTSPOTS_DATA[selectedPage.path]?.[selectedDevice] || [];

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
              Visual Heatmaps
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">Identify user click hotspots and frustration areas from real simulated activity.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
            
            <button 
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                showOverlay 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showOverlay ? 'Hide Heatmap' : 'Show Heatmap'}
            </button>
          </div>
        </div>

        {/* Filters and Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Page Selector */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Active URL Path</label>
            <div className="relative">
              <select 
                value={selectedPage.path}
                onChange={(e) => {
                  const pg = PAGES.find(p => p.path === e.target.value);
                  if (pg) setSelectedPage(pg);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50 focus:outline-none appearance-none cursor-pointer pr-10"
              >
                {PAGES.map(p => (
                  <option key={p.path} value={p.path}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Device Tabs */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Device Type</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
              {DEVICES.map(dev => {
                const Icon = dev.icon;
                const active = selectedDevice === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDevice(dev.id)}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active 
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {dev.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Clicks</span>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selectedPage.clicks}</span>
            </div>
            <div className="flex flex-col justify-center border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Avg Scroll Depth</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedPage.scrollDepth}</span>
            </div>
          </div>
        </div>

        {/* Live Simulator View & Sidebar info */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Visualizer Board */}
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex items-center justify-center overflow-auto min-h-[620px]">
            <div className={`relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-800 shadow-lg overflow-hidden transition-all duration-300 ${activeDeviceData.dimensions}`}>
              
              {/* Mock Browser URL Bar */}
              <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-1 px-3 text-xs text-zinc-500 dark:text-zinc-400 truncate text-center select-none">
                  ecostore.com{selectedPage.path}
                </div>
              </div>

              {/* Mockup Frame Content */}
              <div className="relative w-full h-[calc(100%-44px)] overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-900 select-none">
                
                {/* Simulated Webpage Layout content depending on selected page */}
                {selectedPage.path === '/' && (
                  <div className="space-y-8 py-4">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                      <span className="font-bold text-indigo-600">EcoStore</span>
                      <div className="hidden sm:flex gap-4 text-xs font-semibold text-zinc-500">
                        <span>Products</span>
                        <span>Categories</span>
                        <span>Blog</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px]">🛒</div>
                    </div>

                    {/* Hero section */}
                    <div className="text-center space-y-4 py-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-6">
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">SALE EXTENDED</span>
                      <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Sounds Premium, Fits Naturally.</h2>
                      <p className="text-xs text-zinc-500 max-w-md mx-auto">Get up to 40% off high-fidelity sound equipment today with free worldwide shipping.</p>
                      <div className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 cursor-pointer">
                        Shop Now
                      </div>
                    </div>

                    {/* Featured Product grid mockup */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-800 flex flex-col justify-between min-h-[140px]">
                        <div className="w-full h-20 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-xs">🎧 Premium Headphones</div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs font-bold">$199.99</span>
                          <span className="text-[10px] text-indigo-600 font-semibold">View</span>
                        </div>
                      </div>
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-800 flex flex-col justify-between min-h-[140px]">
                        <div className="w-full h-20 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-xs">🔊 Wireless Speaker</div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs font-bold">$149.99</span>
                          <span className="text-[10px] text-zinc-400">Out of Stock</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPage.path === '/products/premium-headphones' && (
                  <div className="space-y-6 py-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>Home</span> / <span>Products</span> / <span className="text-zinc-600 dark:text-zinc-200">Premium Headphones</span>
                    </div>

                    {/* Product visual showcase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                      {/* Left: Images */}
                      <div className="space-y-3">
                        <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center relative group cursor-zoom-in">
                          <span className="text-xs font-medium text-zinc-500">🎧 [Interactive Product Image]</span>
                          <div className="absolute top-3 right-3 p-1.5 bg-white dark:bg-zinc-700 rounded-full shadow-md text-xs">❤️</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 border border-indigo-500 rounded-lg" />
                          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                        </div>
                      </div>

                      {/* Right: Info and Purchase */}
                      <div className="space-y-4">
                        <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Premium ANC Headphones</h2>
                        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                          <span className="text-amber-500">★★★★☆</span>
                          <span>(4.8 rating / 104 reviews)</span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Active noise cancelling with 40-hour battery life and custom audio tuning.</p>
                        
                        <div className="border-t border-b border-zinc-200 dark:border-zinc-800 py-3 flex justify-between items-center">
                          <span className="text-lg font-bold">$199.99</span>
                          <span className="text-[10px] text-green-600 font-bold bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-full">In Stock</span>
                        </div>

                        {/* Add to Cart button */}
                        <div className="w-full py-3 bg-indigo-600 text-white text-center rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-md">
                          Add to Cart
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPage.path === '/checkout' && (
                  <div className="space-y-6 py-2">
                    <h2 className="text-md font-bold text-zinc-900 dark:text-zinc-100 border-b pb-3">Checkout Form</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      
                      {/* Shipping details (2/3 width) */}
                      <div className="sm:col-span-2 space-y-3">
                        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400">1. SHIPPING ADDRESS</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">First Name</div>
                          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">Last Name</div>
                        </div>
                        <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">Street Address</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">City</div>
                          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">Postal Code</div>
                        </div>
                        <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">Phone Number (Required)</div>
                      </div>

                      {/* Summary & Apply coupon (1/3 width) */}
                      <div className="space-y-4 bg-zinc-100 dark:bg-zinc-800/40 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400">ORDER SUMMARY</h3>
                        <div className="flex justify-between text-xs">
                          <span>Premium Headphones</span>
                          <span className="font-bold">$199.99</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 flex items-center text-[10px] text-zinc-400">Coupon Code</div>
                          <div className="px-3 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-[10px] font-bold flex items-center hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer">Apply</div>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          <span>Total</span>
                          <span>$199.99</span>
                        </div>

                        <div className="w-full py-2.5 bg-indigo-600 text-white text-center rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer">
                          Place Order
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* --- HEATMAP OVERLAY COMPONENT --- */}
                {showOverlay && !isRefreshing && hotspots.map((spot, idx) => {
                  // Style colors based on intensity
                  const colorMap = {
                    high: 'from-red-500/70 via-orange-400/50 to-transparent',
                    medium: 'from-amber-400/60 via-yellow-300/40 to-transparent',
                    low: 'from-blue-400/50 via-teal-300/30 to-transparent'
                  };

                  return (
                    <div 
                      key={idx}
                      className="absolute group/spot transition-all duration-300"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 30
                      }}
                    >
                      {/* Visual Pulse Glow */}
                      <div 
                        className={`rounded-full bg-gradient-to-radial ${colorMap[spot.intensity]} animate-pulse`}
                        style={{
                          width: `${spot.radius * 2.2}px`,
                          height: `${spot.radius * 2.2}px`
                        }}
                      />
                      
                      {/* Central Hot Dot */}
                      <div 
                        className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          spot.intensity === 'high' 
                            ? 'bg-red-600' 
                            : spot.intensity === 'medium' 
                            ? 'bg-orange-500' 
                            : 'bg-teal-500'
                        }`} 
                      />

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 bg-zinc-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/spot:opacity-100 group-hover/spot:scale-100 transition-all duration-200 whitespace-nowrap z-50">
                        <div className="font-bold text-amber-300">{spot.clicks} clicks</div>
                        <div className="text-zinc-400">{spot.label}</div>
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          </div>

          {/* Right Sidebar list of Hotspots */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* Legend & Instructions */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                Understanding Click Densities
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hover over the pulse indicators on the page mockup to inspect click volume, or browse the hotspot breakdown list below.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">High Density (CTAs, primary buttons)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Medium Density (Sub-actions, secondary links)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400 opacity-80" />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Low Density (Footer links, secondary navigation)</span>
                </div>
              </div>
            </div>

            {/* Hotspots Breakdown List */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-indigo-500" />
                Hotspot Ranking
              </h4>
              
              <div className="space-y-3">
                {hotspots.map((spot, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col pr-2 min-w-0">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{spot.label}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Relative Pos: X: {spot.x}%, Y: {spot.y}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        spot.intensity === 'high' 
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/20' 
                          : spot.intensity === 'medium'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                          : 'bg-teal-50 text-teal-600 dark:bg-teal-950/20'
                      }`}>
                        {spot.clicks}
                      </span>
                    </div>
                  </div>
                ))}

                {hotspots.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs italic">
                    No active hotspots for this screen.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Shell>
  );
}
