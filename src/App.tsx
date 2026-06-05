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
import ScrollRevealText from './components/ScrollRevealText';

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
  
  // Gallery Theme: Locked to 'light' for premium linen aesthetic
  const theme = 'light';
  
  // Dashboard & UX Controls
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  // Success notification banner state (when a new work is posted)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter and Sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'price-asc' | 'price-desc'

  const featuredList = useMemo(() => {
    const ids = ['painting-8', 'painting-7', 'painting-6', 'painting-5'];
    const selected = ids.map(id => paintings.find(p => p.id === id)).filter(Boolean) as Painting[];
    if (selected.length === 0) {
      return paintings.slice(0, 4);
    }
    return selected;
  }, [paintings]);

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

  // Slideshow autoplay effect
  useEffect(() => {
    if (featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredList]);

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
    <div id="gallery-app-root" className={`min-h-screen transition-colors duration-300 selection:bg-amber-500/20 selection:text-amber-350 relative overflow-hidden ${
      theme === 'dark' ? 'reference-dark-bg text-stone-200' : 
      theme === 'funky' ? 'bg-[#0a0418] text-purple-200' : 
      'bg-artist-bg text-stone-900'
    }`}>
      
      {/* Slow animated background glowing fluid leaks for Dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[8%] left-[10%] w-[380px] h-[380px] rounded-full bg-cyan-500/12 blur-[110px] animate-fluid-blob" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[28%] right-[8%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px] animate-fluid-blob" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-[25%] left-[18%] w-[500px] h-[500px] rounded-full bg-amber-500/6 blur-[120px] animate-fluid-blob" style={{ animationDelay: '6s' }} />
          <div className="absolute bottom-[5%] right-[20%] w-[350px] h-[350px] rounded-full bg-cyan-500/8 blur-[100px] animate-fluid-blob" style={{ animationDelay: '9s' }} />
        </div>
      )}

      
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
        <motion.header
          id="gallery-masthead"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 flex flex-col md:flex-row justify-between items-center mb-12 border-b pb-6 mt-2 transition-colors duration-300 ${
            theme === 'dark' ? 'border-white/10 text-stone-100' : 
            theme === 'funky' ? 'border-purple-955/60 text-purple-100' : 
            'border-stone-200/60 text-stone-900'
          }`}
        >
          {/* Unified Logo & Artist Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            {/* Abstract logo emblem SVG */}
            <div className="w-11 h-11 md:w-12 md:h-12 shrink-0 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                    {theme === 'funky' ? (
                      <>
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </>
                    )}
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradHeader)" strokeWidth="6" className="opacity-40" />
                <path d="M30,50 Q45,25 55,75 T80,50" fill="none" stroke="url(#logoGradHeader)" strokeWidth="8" strokeLinecap="round" />
                <circle cx="50" cy="50" r="15" fill="url(#logoGradHeader)" className="opacity-80" />
              </svg>
            </div>
             <div className="flex flex-col text-left">
              <span className={`font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-widest leading-none uppercase ${
                theme === 'funky' ? 'text-white text-glow-cyan' : ''
              }`}>
                {artistProfile.name}
              </span>
            </div>
          </div>

          {/* Unified Navigation Links */}
          <nav className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mt-4 md:mt-0 ${
            theme === 'dark' ? 'text-stone-300' : 
            theme === 'funky' ? 'text-purple-305' : 
            'text-stone-805'
          }`}>
            <a href="#gallery-controls-console" className={`pb-1 transition-colors ${
              theme === 'dark' ? 'border-b border-amber-500 text-stone-100 hover:text-amber-400' : 
              theme === 'funky' ? 'border-b border-fuchsia-500 text-fuchsia-400 hover:text-fuchsia-300' : 
              'border-b border-black text-stone-900 hover:text-amber-805'
            }`}>Gallery</a>
            <a href="#upcoming-exhibitions-section" className={`opacity-70 hover:opacity-100 transition-colors ${
              theme === 'dark' ? 'hover:text-amber-400' : 
              theme === 'funky' ? 'hover:text-fuchsia-400 text-glow-neon' : 
              'hover:text-stone-500'
            }`}>Exhibitions</a>
            <a href="#artist-profile-panel" className={`opacity-70 hover:opacity-100 transition-colors ${
              theme === 'dark' ? 'hover:text-amber-400' : 
              theme === 'funky' ? 'hover:text-fuchsia-400 text-glow-neon' : 
              'hover:text-amber-800'
            }`}>Biography</a>

            <button 
              onClick={handleToggleAdmin} 
              className="opacity-70 hover:opacity-100 uppercase text-[10px] sm:text-[11px] font-semibold tracking-widest hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isAdmin ? '🔒 Lock' : '🔓 Unlock'}
            </button>
          </nav>
        </motion.header>
        
        {/* Immersive Typographic Exhibition Banner */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden mb-12 py-12 px-6 md:px-12 rounded-3xl border transition-all duration-300 shadow-xl ${
            theme === 'dark' 
              ? 'glass-panel text-stone-100 border-white/10' :
            theme === 'funky'
              ? 'bg-gradient-to-br from-[#1b0840] via-[#10032c] to-[#060017] border-purple-900/50 text-purple-100 shadow-[0_10px_40px_rgba(127,0,255,0.2)]'
              : 'bg-white border-stone-200/80 text-stone-900'
          }`}
        >
          {/* Spotlight overlay */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            theme === 'dark' ? 'opacity-100 museum-spotlight' : 
            theme === 'funky' ? 'opacity-100 scanlines bg-gradient-to-r from-purple-800/10 via-fuchsia-700/10 to-cyan-500/10' : 
            'opacity-20'
          }`} />
          
          {theme === 'dark' && (
            /* Subtle decorative circles or gradient shapes inside the banner (similar to mockup background) */
            <div className="absolute top-[-10%] right-[-5%] w-60 h-60 rounded-full bg-cyan-400/10 filter blur-2xl pointer-events-none" />
          )}

          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/canvas-paper.png')] canvas-grain" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content column */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
              <span className={`text-[9px] uppercase tracking-[0.45em] font-bold ${
                theme === 'dark' ? 'text-amber-400' :
                theme === 'funky' ? 'text-fuchsia-400 text-glow-neon' :
                'text-amber-805'
              }`}>
                Featured Exhibition
              </span>
              <h2 className={`font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-wide uppercase leading-tight ${
                theme === 'dark' ? 'text-stone-105' :
                theme === 'funky' ? 'text-white text-glow-cyan' :
                'text-stone-900'
              }`}>
                EXPLORE THE SUBCONSCIOUS CANVAS
              </h2>
              <p className={`font-serif italic text-sm sm:text-base max-w-xl leading-relaxed ${
                theme === 'dark' ? 'text-stone-300' :
                theme === 'funky' ? 'text-purple-200' :
                'text-stone-605'
              }`}>
                A collection of contemporary surrealist abstract works. Welcome to the visual world of {artistProfile.name}.
              </p>
              <div className="pt-3">
                <a 
                  href="#gallery-controls-console" 
                  className={`px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-350 cursor-pointer shadow-md inline-block ${
                    theme === 'dark' 
                      ? 'btn-glow-amber text-amber-400 hover:text-white' :
                    theme === 'funky'
                      ? 'border border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400 hover:text-white hover:bg-fuchsia-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                      : 'border border-stone-800 bg-stone-900 text-white hover:bg-stone-850'
                  }`}
                >
                  View Gallery
                </a>
              </div>
            </div>

            {/* Right Image column */}
            <div className="md:col-span-5 flex flex-col justify-center items-center w-full min-h-[380px] sm:min-h-[440px] relative">
              <AnimatePresence mode="wait">
                {featuredList[featuredIndex] && (
                  <motion.div
                    key={featuredList[featuredIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <div 
                      className={`relative group p-2 border rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl w-full max-w-[280px] sm:max-w-[320px] aspect-3/4 flex items-center justify-center ${
                        theme === 'dark' ? 'bg-black/30 border-white/10 shadow-black/60' :
                        theme === 'funky' ? 'holo-mount border-purple-955 shadow-[inset_0_2px_12px_rgba(255,255,255,0.4)] shadow-purple-955/30' :
                        'bg-[#FCFAF5] border-stone-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)] p-3 rounded-md'
                      }`}
                      onClick={() => setSelectedPainting(featuredList[featuredIndex])}
                    >
                      {/* Beveled edge cut of the mat board */}
                      {theme !== 'dark' && (
                        <div className={`absolute inset-[10px] border pointer-events-none transition-colors duration-300 ${
                          theme === 'funky' ? 'border-white/20' : 'border-stone-300/20'
                        }`} />
                      )}
                      
                      <img 
                        src={featuredList[featuredIndex].imageUrl} 
                        alt={featuredList[featuredIndex].title} 
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover shadow-md ${theme === 'dark' ? 'rounded-xl' : ''}`} 
                      />

                      {/* Badge showing it's the featured piece */}
                      <span className={`absolute -top-2.5 -right-2.5 px-3 py-1 text-[8px] font-sans font-bold uppercase tracking-wider rounded-md border shadow-md ${
                        theme === 'funky'
                          ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                          : 'bg-amber-600 border-amber-500 text-white'
                      }`}>
                        Featured
                      </span>
                    </div>
                    <span className={`font-serif text-[10px] tracking-[0.25em] uppercase select-none mt-1 ${
                      theme === 'dark' ? 'text-stone-400' :
                      theme === 'funky' ? 'text-fuchsia-400 text-glow-neon font-bold' :
                      'text-stone-505'
                    }`}>
                      {featuredList[featuredIndex].title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
                {/* Slides/Carousel navigation dots indicators at the bottom */}
          <div className="flex justify-center items-center gap-2 mt-8 z-10 relative">
            {featuredList.map((_, idx) => {
              const isActive = featuredIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 border-0 ${
                    isActive
                      ? theme === 'dark' ? 'bg-amber-400 w-4 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                        theme === 'funky' ? 'bg-fuchsia-500 w-4 shadow-[0_0_8px_rgba(236,72,153,0.6)]' :
                        'bg-stone-800 w-4'
                      : theme === 'dark' ? 'bg-stone-500/30 hover:bg-stone-500/50' :
                        theme === 'funky' ? 'bg-purple-900/40 hover:bg-purple-900/60' :
                        'bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Main Content Area */}
        <main className="relative z-10 space-y-12">
          
          {/* Section: Gallery Works & Curation Panel */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            
            {/* Center-aligned section header for dark mode */}
            {theme === 'dark' && (
              <div className="text-center py-4">
                 <h2 className="font-serif text-2xl md:text-3xl font-black uppercase tracking-[0.25em] text-stone-100">
                   Featured Works
                 </h2>
                 <div className="w-16 h-[2px] bg-amber-500/50 mx-auto mt-3" />
               </div>
            )}

            <div id="gallery-controls-console" className={`p-4 rounded-2xl shadow-2xs border transition-all duration-300 ${
              theme === 'dark' ? 'glass-card border-white/10 text-stone-100' : 
              theme === 'funky' ? 'bg-[#150d2c] border-purple-900/65 text-purple-100 shadow-[0_4px_20px_rgba(127,0,255,0.05)]' : 
              'bg-white border-stone-200/80 text-stone-900'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Left: Reset & Search */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Reset button if filters are active */}
                  {(searchQuery || mediumFilter !== 'All' || statusFilter !== 'All') && (
                    <button
                      onClick={handleResetFilters}
                      className={`text-[11px] font-sans font-semibold underline cursor-pointer ${
                        theme === 'dark' ? 'text-amber-400 hover:text-amber-350' : 'text-amber-805 hover:text-amber-955'
                      }`}
                    >
                      Clear
                    </button>
                  )}

                  {/* Search query input */}
                  <div className="relative w-28 sm:w-32 shrink-0">
                    <Search className="absolute left-2 top-2 w-3 h-3 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className={`w-full font-sans text-xs pl-7 pr-2 py-1 border focus:outline-hidden rounded-md transition-all ${
                        theme === 'dark' 
                          ? 'bg-black/20 border-white/10 text-stone-100 focus:bg-black/40 focus:border-amber-500/50' 
                          : 'bg-stone-50 border-stone-200 text-stone-900 focus:bg-white focus:border-amber-805'
                      }`}
                    />
                  </div>
                </div>

                {/* Right side horizontal group for Medium, Status, and Sort */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 flex-grow justify-end w-auto">

                  {/* Medium Filter Pills */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-sans font-bold text-stone-450 uppercase tracking-widest whitespace-nowrap">Medium:</span>
                    <div className="flex flex-wrap gap-1">
                      {availableMediums.map((med) => {
                        const isActive = mediumFilter === med;
                        return (
                          <button
                            key={med}
                            onClick={() => setMediumFilter(med)}
                            className={`px-2.5 py-0.5 rounded-full font-sans text-[11px] font-medium cursor-pointer transition-all duration-200 border ${
                              isActive
                                ? theme === 'dark'
                                  ? 'bg-amber-500 border-amber-500 text-stone-955 font-semibold shadow-xs'
                                  : 'bg-stone-900 border-stone-900 text-amber-550 shadow-xs'
                                : theme === 'dark'
                                  ? 'bg-black/25 border-white/5 text-stone-300 hover:bg-white/5 hover:text-stone-100'
                                  : 'bg-stone-50 border-stone-205 text-stone-605 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            {med}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-sans font-bold text-stone-450 uppercase tracking-widest whitespace-nowrap">Status:</span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { value: 'All', label: 'All' },
                        { value: 'Available', label: 'Available' },
                        { value: 'Reserved', label: 'Reserved' },
                        { value: 'Sold', label: 'Sold' }
                      ].map((status) => {
                        const isActive = statusFilter === status.value;
                        return (
                          <button
                            key={status.value}
                            onClick={() => setStatusFilter(status.value)}
                            className={`px-2.5 py-0.5 rounded-full font-sans text-[11px] font-medium cursor-pointer transition-all duration-200 border ${
                              isActive
                                ? theme === 'dark'
                                  ? 'bg-amber-500 border-amber-500 text-stone-955 font-semibold shadow-xs'
                                  : 'bg-stone-900 border-stone-900 text-amber-550 shadow-xs'
                                : theme === 'dark'
                                  ? 'bg-black/25 border-white/5 text-stone-300 hover:bg-white/5 hover:text-stone-100'
                                  : 'bg-stone-50 border-stone-205 text-stone-605 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sorting & Order Controller */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-sans text-[10px] font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`font-sans text-xs bg-transparent border-0 font-medium cursor-pointer focus:outline-hidden ${
                        theme === 'dark' ? 'text-stone-300 hover:text-amber-400' : 'text-stone-700 hover:text-amber-800'
                      }`}
                    >
                      <option value="newest" className={theme === 'dark' ? 'bg-[#0E0D0C] text-stone-100' : ''}>Recent</option>
                      <option value="oldest" className={theme === 'dark' ? 'bg-[#0E0D0C] text-stone-100' : ''}>Historical</option>
                      <option value="price-asc" className={theme === 'dark' ? 'bg-[#0E0D0C] text-stone-100' : ''}>Price: Low</option>
                      <option value="price-desc" className={theme === 'dark' ? 'bg-[#0E0D0C] text-stone-100' : ''}>Price: High</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* Gallery Paintings Grid list */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                className={`border p-12 text-center rounded-2xl shadow-2xs space-y-4 ${
                  theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white border-stone-250'
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
                    theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-955 font-bold' : 'bg-stone-900 hover:bg-amber-900 text-white'
                  }`}
                >
                  See Full Catalogue
                </button>
              </motion.div>
            )}
          </motion.section>

          {/* Bottom Section: Exhibitions & Profile */}
          <motion.section
            id="upcoming-exhibitions-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8"
          >
            {/* Left Column: Upcoming Exhibitions (4 cols on lg) */}
            <div className={`lg:col-span-4 p-6 rounded-2xl border transition-colors ${
              theme === 'dark' ? 'glass-card text-stone-200' : 
              theme === 'funky' ? 'bg-[#150d2c] border-purple-900/40 text-purple-200 shadow-lg' : 
              'bg-stone-50 border-stone-200/60 text-stone-900 shadow-xs'
            }`}>
              <h3 className={`font-serif text-lg font-bold uppercase tracking-wider mb-6 ${theme === 'dark' ? 'text-stone-100' : ''}`}>
                <ScrollRevealText text="Upcoming Exhibitions" />
              </h3>
              <div className="space-y-6 text-left">
                <div className={`pb-4 border-b ${theme === 'dark' ? 'border-white/10' : theme === 'funky' ? 'border-purple-900/30' : 'border-stone-200'}`}>
                  <h4 className="font-serif font-black text-sm uppercase tracking-wide text-amber-500">
                    <ScrollRevealText text="Mindscapes" />
                  </h4>
                  <p className="font-sans text-xs text-stone-400 mt-1">
                    <ScrollRevealText text="NYC GALLERY" />
                  </p>
                  <p className="font-sans text-[10px] tracking-wider text-stone-500 uppercase mt-0.5">
                    <ScrollRevealText text="Oct 15 - Nov 10" />
                  </p>
                </div>
                <div className={`pb-4 border-b ${theme === 'dark' ? 'border-white/10' : theme === 'funky' ? 'border-purple-900/30' : 'border-stone-200'}`}>
                  <h4 className="font-serif font-black text-sm uppercase tracking-wide text-amber-500">
                    <ScrollRevealText text="Transformations" />
                  </h4>
                  <p className="font-sans text-xs text-stone-400 mt-1">
                    <ScrollRevealText text="PARIS GALLERY" />
                  </p>
                  <p className="font-sans text-[10px] tracking-wider text-stone-500 uppercase mt-0.5">
                    <ScrollRevealText text="Dec 01 - Dec 15" />
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm uppercase tracking-wide text-amber-500">
                    <ScrollRevealText text="Subconscious Waves" />
                  </h4>
                  <p className="font-sans text-xs text-stone-400 mt-1">
                    <ScrollRevealText text="TOKYO ART CENTER" />
                  </p>
                  <p className="font-sans text-[10px] tracking-wider text-stone-500 uppercase mt-0.5">
                    <ScrollRevealText text="Jan 20 - Feb 10" />
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Artist Bio / Profile (8 cols on lg) */}
            <div className="lg:col-span-8">
              <ArtistProfileSection
                profile={artistProfile}
                paintings={paintings}
                onOpenPostModal={() => setIsPostModalOpen(true)}
                isAdmin={isAdmin}
                onToggleAdmin={handleToggleAdmin}
                theme={theme}
              />
            </div>
          </motion.section>
        </main>
      </div>

      {/* Footer copyright */}
      <footer className={`mt-20 border-t py-8 px-4 sm:px-6 lg:px-8 font-sans text-xs transition-colors duration-300 ${
        theme === 'dark' ? 'border-white/10 bg-[#05060A]/80 text-stone-400' : 
        theme === 'funky' ? 'border-purple-955 bg-[#060017] text-purple-400' : 
        'border-stone-200 bg-stone-50 text-stone-505'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-wider font-semibold text-[10px]">
            <a href="#gallery-controls-console" className="hover:text-amber-500 transition-colors">Gallery</a>
            <a href="#upcoming-exhibitions-section" className="hover:text-amber-500 transition-colors">Exhibitions</a>
            <a href="#artist-profile-panel" className="hover:text-amber-500 transition-colors">Biography</a>
            <a href={`mailto:${artistProfile.email}`} className="hover:text-amber-500 transition-colors">Contact</a>
          </nav>
          <div className="flex flex-col md:items-end text-center md:text-right gap-1">
            <p>© 2026 {artistProfile.name}. All rights reserved.</p>
            <p className="text-[9px] opacity-75">
              The Morphiq • A collection of messages from the unknown.
            </p>
          </div>
        </div>
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
