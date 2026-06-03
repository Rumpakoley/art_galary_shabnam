/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Painting, ArtistProfile } from './types';
import { INITIAL_PAINTINGS, INITIAL_PROFILE } from './data';
import ArtistProfileSection from './components/ArtistProfileSection';
import PaintingCard from './components/PaintingCard';
import PaintingDetailModal from './components/PaintingDetailModal';
import PostWorkModal from './components/PostWorkModal';
import { Search, SlidersHorizontal, Sliders, Sparkles, CheckCircle2, Paintbrush, ArrowUpDown, X } from 'lucide-react';

export default function App() {
  // Load paintings & profile from localStorage or fallback
  const [paintings, setPaintings] = useState<Painting[]>(() => {
    const stored = localStorage.getItem('artist_paintings_archive');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Painting[];
        // Sync and merge with INITIAL_PAINTINGS:
        // 1. Update imageUrl for existing default paintings to prevent caching issues.
        // 2. Add any newly introduced default paintings that are not yet in localStorage.
        const parsedIds = new Set(parsed.map((p) => p.id));
        const missingDefaults = INITIAL_PAINTINGS.filter((p) => !parsedIds.has(p.id));

        const updatedParsed = parsed.map((p) => {
          const original = INITIAL_PAINTINGS.find((orig) => orig.id === p.id);
          if (original) {
            return { ...p, imageUrl: original.imageUrl };
          }
          return p;
        });

        return [...updatedParsed, ...missingDefaults];
      } catch {
        return INITIAL_PAINTINGS;
      }
    }
    return INITIAL_PAINTINGS;
  });

  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(INITIAL_PROFILE);
  
  // Gallery Theme: Default to 'dark' for premium museum spotlight look
  const [theme, setTheme] = useState<'light' | 'dark' | 'funky'>(() => {
    const stored = localStorage.getItem('artist_theme_preference');
    return (stored as 'light' | 'dark' | 'funky') || 'dark';
  });

  // Sync theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('artist_theme_preference', theme);
  }, [theme]);
  
  // Dashboard & UX Controls
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Success notification banner state (when a new work is posted)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter and Sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'price-asc' | 'price-desc'

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('artist_paintings_archive', JSON.stringify(paintings));
  }, [paintings]);

  // Clean toast notices automatically
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Add painting to portfolio
  const handlePostPainting = (newPainting: Painting) => {
    setPaintings((prev) => [newPainting, ...prev]);
    setIsPostModalOpen(false);
    setToastMessage(`"${newPainting.title}" has been successfully published to your portfolio!`);
  };

  const handleToggleAdmin = () => {
    setIsAdmin((prev) => !prev);
  };

  // Extract unique categories and mediums for filter listing dynamically
  const availableMediums = useMemo(() => {
    const mediums = paintings.map((p) => {
      // Group them into higher level buckets for easy grouping
      if (p.medium.toLowerCase().includes('oil')) return 'Oil';
      if (p.medium.toLowerCase().includes('water')) return 'Watercolor';
      if (p.medium.toLowerCase().includes('acrylic')) return 'Acrylic';
      if (p.medium.toLowerCase().includes('mixed')) return 'Mixed Media';
      return 'Other';
    });
    return ['All', ...Array.from(new Set(mediums))];
  }, [paintings]);

  // Filter and sort paintings selection
  const filteredPaintings = useMemo(() => {
    let result = [...paintings];

    // 1. Text Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.medium.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 2. Medium filtering (grouped match)
    if (mediumFilter !== 'All') {
      result = result.filter((p) => {
        const med = p.medium.toLowerCase();
        if (mediumFilter === 'Oil') return med.includes('oil');
        if (mediumFilter === 'Watercolor') return med.includes('water');
        if (mediumFilter === 'Acrylic') return med.includes('acrylic');
        if (mediumFilter === 'Mixed Media') return med.includes('mixed');
        return !med.includes('oil') && !med.includes('water') && !med.includes('acrylic') && !med.includes('mixed');
      });
    }

    // 3. Status filtering
    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // 4. Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return a.year - b.year || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        // Treat NFS/Null prices as infinity
        const pA = a.price === null ? Infinity : a.price;
        const pB = b.price === null ? Infinity : b.price;
        return pA - pB;
      }
      if (sortBy === 'price-desc') {
        const pA = a.price === null ? -Infinity : a.price;
        const pB = b.price === null ? -Infinity : b.price;
        return pB - pA;
      }
      return 0;
    });

    return result;
  }, [paintings, searchQuery, mediumFilter, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setMediumFilter('All');
    setStatusFilter('All');
    setSortBy('newest');
  };

  const nameParts = artistProfile.name.split(' ');

  return (
    <div id="gallery-app-root" className={`min-h-screen transition-colors duration-300 selection:bg-amber-500/20 selection:text-amber-350 ${
      theme === 'dark' ? 'bg-[#0D0C0B] text-stone-200' : 
      theme === 'funky' ? 'bg-[#0a0418] text-purple-200' : 
      'bg-artist-bg text-stone-900'
    }`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 border px-5 py-3.5 rounded-lg shadow-xl flex items-center gap-3 max-w-sm md:max-w-md w-[90vw] ${
              theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100' : 
              theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 
              'bg-stone-900 border-stone-850 text-stone-100'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-amber-555 shrink-0" />
            <div className="flex-grow">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-amber-500">Registry Updated</p>
              <p className="font-sans text-xs mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Curatorial Header of Artistic Flair Theme */}
        <header id="gallery-masthead" className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b pb-8 mt-2 transition-colors duration-300 ${
          theme === 'dark' ? 'border-stone-850 text-stone-100' : 
          theme === 'funky' ? 'border-purple-950/60 text-purple-100' : 
          'border-stone-200/60 text-stone-900'
        }`}>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase tracking-[0.3em] font-semibold mb-2 ${
              theme === 'dark' ? 'text-stone-400' : 
              theme === 'funky' ? 'text-fuchsia-400 text-glow-neon font-bold' : 
              'text-stone-505'
            }`}>Studio Gallery / Est. 2026</span>
            <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase flex flex-wrap items-baseline gap-x-4">
              {nameParts[0]} <span className="outline-text">{nameParts.slice(1).join(' ')}</span>
            </h1>
          </div>
          <nav className={`flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-semibold mt-4 md:mt-0 ${
            theme === 'dark' ? 'text-stone-300' : 
            theme === 'funky' ? 'text-purple-305' : 
            'text-stone-805'
          }`}>
            <a href="#gallery-controls-console" className={`border-b pb-1 transition-colors ${
              theme === 'dark' ? 'border-amber-550 text-amber-405 hover:text-amber-300' : 
              theme === 'funky' ? 'border-fuchsia-500 text-fuchsia-400 hover:text-fuchsia-300' : 
              'border-black text-stone-900 hover:text-amber-800'
            }`}>Works</a>
            <a href="#artist-profile-panel" className={`opacity-70 hover:opacity-100 transition-colors ${
              theme === 'dark' ? 'hover:text-amber-400' : 
              theme === 'funky' ? 'hover:text-fuchsia-400 text-glow-neon' : 
              'hover:text-amber-800'
            }`}>Studio</a>
            <button 
              onClick={() => setTheme(t => t === 'dark' ? 'funky' : t === 'funky' ? 'light' : 'dark')}
              className="opacity-70 hover:opacity-100 uppercase text-[11px] font-semibold tracking-widest hover:text-amber-400 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? '🌙 Obsidian Dark' : theme === 'funky' ? '👾 Neon Funky' : '☀️ Linen Light'}
            </button>
            <button 
              onClick={handleToggleAdmin} 
              className="opacity-70 hover:opacity-100 uppercase text-[11px] font-semibold tracking-widest hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isAdmin ? '🔒 Lock Registry' : '🔓 Unlock Registry'}
            </button>
          </nav>
        </header>

        {/* Immersive Typographic Exhibition Banner */}
        <section className={`relative overflow-hidden mb-12 py-16 px-6 md:px-12 rounded-2xl border transition-all duration-300 flex flex-col justify-center items-center text-center shadow-xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#161513] to-[#0F0E0D] border-stone-850 text-stone-100' :
          theme === 'funky'
            ? 'bg-gradient-to-br from-[#1b0840] via-[#10032c] to-[#060017] border-purple-900/50 text-purple-100 shadow-[0_10px_40px_rgba(127,0,255,0.2)]'
            : 'bg-white border-stone-200/80 text-stone-900'
        }`}>
          {/* Spotlight overlay */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            theme === 'dark' ? 'opacity-100 museum-spotlight' : 
            theme === 'funky' ? 'opacity-100 scanlines bg-gradient-to-r from-purple-800/10 via-fuchsia-700/10 to-cyan-500/10' : 
            'opacity-20'
          }`} />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/canvas-paper.png')] canvas-grain" />
          
          <span className={`text-[10px] uppercase tracking-[0.45em] font-bold mb-4 ${
            theme === 'dark' ? 'text-amber-400' : 
            theme === 'funky' ? 'text-fuchsia-400 text-glow-neon' : 
            'text-amber-805'
          }`}>
            Now Exhibiting
          </span>
          <h2 className="serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase max-w-4xl leading-tight">
            THE <span className={
              theme === 'dark' ? 'text-amber-500 animate-pulse' : 
              theme === 'funky' ? 'text-[#00ffff] text-glow-cyan' : 
              'text-amber-800'
            }>MORPHIQ</span>
          </h2>
          <p className={`font-serif italic text-sm sm:text-base md:text-lg mt-3 max-w-xl ${
            theme === 'dark' ? 'text-stone-300' : 
            theme === 'funky' ? 'text-purple-300 font-medium' : 
            'text-stone-605'
          }`}>
            "A collection of messages from the unknown, waiting to find their meaning in you."
          </p>
          <div className={`w-16 h-[1px] my-6 ${
            theme === 'dark' ? 'bg-amber-500/30' : 
            theme === 'funky' ? 'bg-fuchsia-500/40 shadow-xs' : 
            'bg-amber-800/20'
          }`} />
          
          <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 opacity-80">
            <span>Husne Shabnam</span>
            <span className={theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-500'}>•</span>
            <span>Surrealist Abstract Canvases</span>
            <span className={theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-500'}>•</span>
            <span>Est. 2026</span>
          </div>
          
          <a 
            href="#gallery-controls-console" 
            className={`mt-8 px-6 py-2.5 border text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
              theme === 'dark' 
                ? 'border-amber-500/30 hover:border-amber-400 text-amber-400 hover:text-stone-955 hover:bg-amber-400' :
              theme === 'funky'
                ? 'border-fuchsia-500/40 hover:border-fuchsia-400 text-fuchsia-400 hover:text-stone-955 hover:bg-fuchsia-400 shadow-[0_0_15px_rgba(236,72,153,0.25)]'
                : 'border-amber-850/30 hover:border-amber-850 text-amber-850 hover:text-white hover:bg-amber-850'
            }`}
          >
            Enter Gallery Catalog ({paintings.length} works)
          </a>
        </section>

        {/* Content columns */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
          
          {/* Column 1: Artist Bio & Ledger Stats (3 cols on lg) */}
          <section className="lg:col-span-3 lg:order-1 order-2">
            <ArtistProfileSection
              profile={artistProfile}
              paintings={paintings}
              onOpenPostModal={() => setIsPostModalOpen(true)}
              isAdmin={isAdmin}
              onToggleAdmin={handleToggleAdmin}
              theme={theme}
            />
          </section>

          {/* Column 2: Elegant Decor Vertical Accent (1 col on lg only) */}
          <div className={`lg:col-span-1 relative hidden lg:flex items-center justify-center border-r border-l py-12 select-none transition-colors duration-300 ${
            theme === 'dark' ? 'border-stone-850/50 text-stone-400' : 
            theme === 'funky' ? 'border-purple-900/25 text-purple-400' : 
            'border-stone-200/50 text-stone-400'
          }`}>
            <div className={`vertical-text text-[10px] uppercase tracking-[0.55em] font-semibold font-sans whitespace-nowrap ${
              theme === 'funky' ? 'text-glow-neon text-fuchsia-400 font-bold' : ''
            }`}>
              CURRENT EXHIBITION — THE MORPHIQ
            </div>
          </div>

          {/* Column 3: Gallery Works & Curation Panel (8 cols on lg) */}
          <section className="lg:col-span-8 lg:order-2 order-1 space-y-6">
            
            {/* Elegant Filtering Console */}
            <div id="gallery-controls-console" className={`p-5 rounded-xl shadow-2xs space-y-4 border transition-all duration-300 ${
              theme === 'dark' ? 'bg-[#121110] border-stone-850/80 text-stone-100' : 
              theme === 'funky' ? 'bg-[#150d2c] border-purple-900/65 text-purple-100 shadow-[0_4px_20px_rgba(127,0,255,0.05)]' : 
              'bg-white border-stone-200/80 text-stone-900'
            }`}>
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b ${
                theme === 'dark' ? 'border-stone-800' : 
                theme === 'funky' ? 'border-purple-900/50' : 
                'border-stone-150'
              }`}>
                <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
                  <Sliders className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-amber-400' : 
                    theme === 'funky' ? 'text-fuchsia-400 font-bold' : 
                    'text-amber-800/60'
                  }`} />
                  <span>The Curatorial Collection ({filteredPaintings.length} works)</span>
                </h3>

                {/* Reset button if filters are active */}
                {(searchQuery || mediumFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className={`text-[11px] font-sans font-semibold underline self-start md:self-auto cursor-pointer ${
                      theme === 'dark' ? 'text-amber-450 hover:text-amber-350' : 'text-amber-800 hover:text-amber-950'
                    }`}
                  >
                    Clear Catalog Filters
                  </button>
                )}
              </div>

              {/* Filtering Controls Row */}
              <div className="space-y-4">
                {/* Search query input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, medium, details..."
                    className={`w-full font-sans text-xs pl-9 pr-4 py-2.5 border focus:outline-hidden rounded-md shadow-2xs transition-all ${
                      theme === 'dark' 
                        ? 'bg-stone-900 border-stone-800 text-stone-100 focus:bg-stone-950 focus:border-amber-500' 
                        : 'bg-stone-50 border-stone-200/60 text-stone-900 focus:bg-white focus:border-amber-800'
                    }`}
                  />
                </div>

                {/* Pill-based filters */}
                <div className="flex flex-col gap-3">
                  {/* Medium Filter Pills */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-sans font-bold text-stone-450 uppercase tracking-widest">Medium / Material</span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableMediums.map((med) => {
                        const isActive = mediumFilter === med;
                        return (
                          <button
                            key={med}
                            onClick={() => setMediumFilter(med)}
                            className={`px-3 py-1 rounded-full font-sans text-xs font-medium cursor-pointer transition-all duration-200 border ${
                              isActive
                                ? theme === 'dark'
                                  ? 'bg-amber-500 border-amber-500 text-stone-950 font-semibold shadow-xs'
                                  : 'bg-stone-900 border-stone-900 text-amber-500 shadow-xs'
                                : theme === 'dark'
                                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            {med}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-sans font-bold text-stone-450 uppercase tracking-widest">Availability Status</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'All', label: 'All Works' },
                        { value: 'Available', label: 'Available' },
                        { value: 'Reserved', label: 'Reserved' },
                        { value: 'Sold', label: 'Sold / Private' }
                      ].map((status) => {
                        const isActive = statusFilter === status.value;
                        return (
                          <button
                            key={status.value}
                            onClick={() => setStatusFilter(status.value)}
                            className={`px-3 py-1 rounded-full font-sans text-xs font-medium cursor-pointer transition-all duration-200 border ${
                              isActive
                                ? theme === 'dark'
                                  ? 'bg-amber-500 border-amber-500 text-stone-950 font-semibold shadow-xs'
                                  : 'bg-stone-900 border-stone-900 text-amber-500 shadow-xs'
                                : theme === 'dark'
                                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sorting & Order Controller */}
              <div className={`pt-2 flex items-center justify-between text-xs border-t ${
                theme === 'dark' ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-500'
              }`}>
                <span className="font-sans text-[11px]">
                  Viewing {filteredPaintings.length} of {paintings.length} archived canvases
                </span>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-sans text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`font-sans text-xs bg-transparent border-0 font-medium cursor-pointer focus:outline-hidden ${
                      theme === 'dark' ? 'text-stone-350 hover:text-amber-400' : 'text-stone-700 hover:text-amber-800'
                    }`}
                  >
                    <option value="newest" className={theme === 'dark' ? 'bg-stone-900 text-stone-150' : ''}>Recent Paintings</option>
                    <option value="oldest" className={theme === 'dark' ? 'bg-stone-900 text-stone-150' : ''}>Historical First</option>
                    <option value="price-asc" className={theme === 'dark' ? 'bg-stone-900 text-stone-150' : ''}>Price: Low to High</option>
                    <option value="price-desc" className={theme === 'dark' ? 'bg-stone-900 text-stone-150' : ''}>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gallery Paintings Grid list */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPaintings.map((painting) => (
                  <PaintingCard
                    key={painting.id}
                    painting={painting}
                    onViewDetails={setSelectedPainting}
                    theme={theme}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty matching result indicator */}
            {filteredPaintings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border p-12 text-center rounded-xl shadow-2xs space-y-4 ${
                  theme === 'dark' ? 'bg-[#121110] border-stone-850' : 'bg-white border-stone-250'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                  theme === 'dark' ? 'bg-stone-900 text-stone-400' : 'bg-stone-100 text-stone-400'
                }`}>
                  <Search className="w-6 h-6" />
                </div>
                <h4 className={`font-serif text-lg font-semibold ${theme === 'dark' ? 'text-stone-150' : 'text-stone-900'}`}>No Painting Matches Found</h4>
                <p className="font-sans text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  There are no archived works in our gallery matching query "{searchQuery || mediumFilter}". Try clearing your active filters or typing other materials.
                </p>
                <button
                  onClick={handleResetFilters}
                  className={`px-5 py-2 font-sans text-xs uppercase tracking-wider rounded-md cursor-pointer transition-colors shadow-2xs ${
                    theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold' : 'bg-stone-900 hover:bg-amber-900 text-white'
                  }`}
                >
                  See Full Catalogue
                </button>
              </motion.div>
            )}
          </section>
        </main>
      </div>

      {/* Footer copyright */}
      <footer className={`mt-20 border-t py-10 text-center font-sans text-xs transition-colors duration-300 ${
        theme === 'dark' ? 'border-stone-850 bg-[#0A0909] text-stone-450' : 'border-stone-200 bg-stone-50 text-stone-505'
      }`}>
        <p>© 2026 {artistProfile.name}. All rights reserved.</p>
        <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
          The Morphiq • A collection of messages from the unknown, waiting to find their meaning in you.
        </p>
      </footer>

      {/* Detail Overlay Painting Modal */}
      {selectedPainting && (
        <PaintingDetailModal
          painting={selectedPainting}
          onClose={() => setSelectedPainting(null)}
          theme={theme}
        />
      )}

      {/* Creator Painting Poster Modal */}
      {isPostModalOpen && (
        <PostWorkModal
          onClose={() => setIsPostModalOpen(false)}
          onPost={handlePostPainting}
          theme={theme}
        />
      )}
    </div>
  );
}
