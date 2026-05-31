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
        // Always use the fresh image URL from INITIAL_PAINTINGS for default paintings to prevent caching/stale URL issues
        return parsed.map((p) => {
          const original = INITIAL_PAINTINGS.find((orig) => orig.id === p.id);
          if (original) {
            return { ...p, imageUrl: original.imageUrl };
          }
          return p;
        });
      } catch {
        return INITIAL_PAINTINGS;
      }
    }
    return INITIAL_PAINTINGS;
  });

  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(INITIAL_PROFILE);
  
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
    <div id="gallery-app-root" className="min-h-screen bg-artist-bg text-stone-900 selection:bg-gold-100 selection:text-gold-800">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-stone-850 text-stone-100 px-5 py-3.5 rounded-lg shadow-xl flex items-center gap-3 max-w-sm md:max-w-md w-[90vw]"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
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
        <header id="gallery-masthead" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-stone-200/60 pb-8 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-stone-500 mb-2">Studio Gallery / Est. 2026</span>
            <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-stone-950 uppercase flex flex-wrap items-baseline gap-x-4">
              {nameParts[0]} <span className="outline-text">{nameParts.slice(1).join(' ')}</span>
            </h1>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest font-semibold mt-4 md:mt-0 text-stone-800">
            <a href="#gallery-controls-console" className="border-b border-black pb-1 hover:text-amber-800 transition-colors">Works</a>
            <a href="#artist-profile-panel" className="opacity-60 hover:opacity-100 hover:text-amber-800 transition-colors">Studio</a>
            <button 
              onClick={handleToggleAdmin} 
              className="opacity-60 hover:opacity-100 uppercase text-[11px] font-semibold tracking-widest hover:text-amber-800 transition-colors cursor-pointer"
            >
              {isAdmin ? '🔒 Lock Registry' : '🔓 Unlock Registry'}
            </button>
          </nav>
        </header>

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
            />
          </section>

          {/* Column 2: Elegant Decor Vertical Accent (1 col on lg only) */}
          <div className="lg:col-span-1 relative hidden lg:flex items-center justify-center border-r border-l border-stone-200/50 py-12 select-none">
            <div className="vertical-text text-[10px] uppercase tracking-[0.55em] text-stone-400 font-semibold font-sans whitespace-nowrap">
              CURRENT EXHIBITION — THE MORPHIQ
            </div>
          </div>

          {/* Column 3: Gallery Works & Curation Panel (8 cols on lg) */}
          <section className="lg:col-span-8 lg:order-2 order-1 space-y-6">
            
            {/* Elegant Filtering Console */}
            <div id="gallery-controls-console" className="bg-white border border-stone-200/80 p-5 rounded-xl shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-150">
                <h3 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-800/60" />
                  <span>The Curatorial Collection ({filteredPaintings.length} works)</span>
                </h3>

                {/* Reset button if filters are active */}
                {(searchQuery || mediumFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-sans font-semibold text-amber-800 hover:text-amber-950 underline self-start md:self-auto cursor-pointer"
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
                    className="w-full font-sans text-xs pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200/60 focus:bg-white focus:border-amber-800 focus:outline-hidden rounded-md shadow-2xs transition-all"
                  />
                </div>

                {/* Pill-based filters */}
                <div className="flex flex-col gap-3">
                  {/* Medium Filter Pills */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Medium / Material</span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableMediums.map((med) => {
                        const isActive = mediumFilter === med;
                        return (
                          <button
                            key={med}
                            onClick={() => setMediumFilter(med)}
                            className={`px-3 py-1 rounded-full font-sans text-xs font-medium cursor-pointer transition-all duration-200 border ${
                              isActive
                                ? 'bg-stone-900 border-stone-900 text-amber-500 shadow-xs'
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
                    <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Availability Status</span>
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
                                ? 'bg-stone-900 border-stone-900 text-amber-500 shadow-xs'
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
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span className="font-sans text-[11px]">
                  Viewing {filteredPaintings.length} of {paintings.length} archived canvases
                </span>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-sans text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-sans text-xs bg-transparent border-0 text-stone-700 font-medium hover:text-amber-800 cursor-pointer focus:outline-hidden"
                  >
                    <option value="newest">Recent Paintings</option>
                    <option value="oldest">Historical First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
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
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty matching result indicator */}
            {filteredPaintings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-stone-200 p-12 text-center rounded-xl shadow-2xs space-y-4"
              >
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-stone-900">No Painting Matches Found</h4>
                <p className="font-sans text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  There are no archived works in our gallery matching query "{searchQuery || mediumFilter}". Try clearing your active filters or typing other materials.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-stone-900 hover:bg-amber-900 text-white font-sans text-xs uppercase tracking-wider rounded-md cursor-pointer transition-colors shadow-2xs"
                >
                  See Full Catalogue
                </button>
              </motion.div>
            )}
          </section>
        </main>
      </div>

      {/* Footer copyright */}
      <footer className="mt-20 border-t border-stone-200 bg-stone-50 py-10 text-center font-sans text-xs text-stone-500">
        <p>© 2026 {artistProfile.name}. All rights reserved.</p>
        <p className="text-[10px] text-stone-400 mt-1">
          The Morphiq • A collection of messages from the unknown, waiting to find their meaning in you.
        </p>
      </footer>

      {/* Detail Overlay Painting Modal */}
      {selectedPainting && (
        <PaintingDetailModal
          painting={selectedPainting}
          onClose={() => setSelectedPainting(null)}
        />
      )}

      {/* Creator Painting Poster Modal */}
      {isPostModalOpen && (
        <PostWorkModal
          onClose={() => setIsPostModalOpen(false)}
          onPost={handlePostPainting}
        />
      )}
    </div>
  );
}
