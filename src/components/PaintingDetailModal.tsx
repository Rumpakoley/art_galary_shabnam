/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Painting } from '../types';
import { X, Calendar, SlidersHorizontal, ArrowRight, CheckCircle2, Mail, Info, Layers, Home, Palette } from 'lucide-react';

interface PaintingDetailModalProps {
  painting: Painting | null;
  onClose: () => void;
  theme?: 'light' | 'dark' | 'funky';
}

export default function PaintingDetailModal({ painting, onClose, theme = 'dark' }: PaintingDetailModalProps) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visualizer interactive states
  const [frameStyle, setFrameStyle] = useState<'canvas' | 'oak' | 'black' | 'gold'>('oak');
  const [viewMode, setViewMode] = useState<'frame' | 'wall'>('frame');
  const [wallColor, setWallColor] = useState<'charcoal' | 'linens' | 'sage' | 'burgundy' | 'lava'>(() => {
    return theme === 'funky' ? 'lava' : 'charcoal';
  });

  if (!painting) return null;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;

    setIsSubmitting(true);
    // Simulate a classy inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 1200);
  };

  const isAvailable = painting.status === 'Available';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-955/75 backdrop-blur-xs">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-zoom-out"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative border rounded-xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 min-h-[500px] transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-[#0E0D0C] border-stone-850 text-stone-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)]' :
            theme === 'funky'
              ? 'bg-[#150d2c] border-purple-900/60 text-purple-200 shadow-[0_25px_50px_-12px_rgba(127,0,255,0.4)]'
              : 'bg-stone-50 border-stone-200/80 text-stone-900 shadow-2xl'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all border cursor-pointer shadow-xs ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800' :
              theme === 'funky'
                ? 'bg-purple-955/80 border-purple-800 text-fuchsia-400 hover:text-fuchsia-200 hover:bg-purple-900/90 hover:shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                : 'bg-stone-100/90 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-200/90'
            }`}
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Fine Art Frame Showcase / Interactive Wall Visualizer (7 cols on md) */}
          <div className={`md:col-span-7 p-6 md:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r transition-colors duration-300 relative ${
            theme === 'dark' ? 'bg-[#0E0D0C] border-stone-850' :
            theme === 'funky' ? 'bg-[#0a0418] border-purple-900/40' :
            'bg-stone-100 border-stone-200/70'
          }`}>
            <div className={`absolute inset-0 pointer-events-none ring-1 ring-inset transition-opacity duration-300 ${
              theme === 'dark' ? 'ring-white/5 opacity-40 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]' :
              theme === 'funky' ? 'ring-purple-500/10 opacity-60 shadow-[inset_0_0_50px_rgba(127,0,255,0.2)]' :
              'ring-black/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.04)]'
            }`} />

            {/* Switcher tabs */}
            <div className="flex gap-2 mb-6 z-10 w-full justify-center">
              <button
                onClick={() => setViewMode('frame')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'frame'
                    ? theme === 'funky'
                      ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                      : 'bg-amber-600 text-white shadow-xs'
                    : theme === 'dark' 
                      ? 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100' :
                      theme === 'funky'
                      ? 'bg-purple-950/60 border border-purple-900 text-purple-300 hover:text-purple-100 hover:bg-purple-900/40'
                      : 'bg-white border-stone-200 text-stone-605 hover:text-stone-950'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Frame Configurator
              </button>
              <button
                onClick={() => setViewMode('wall')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'wall'
                    ? theme === 'funky'
                      ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                      : 'bg-amber-600 text-white shadow-xs'
                    : theme === 'dark' 
                      ? 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100' :
                      theme === 'funky'
                      ? 'bg-purple-950/60 border border-purple-900 text-purple-300 hover:text-purple-100 hover:bg-purple-900/40'
                      : 'bg-white border-stone-200 text-stone-605 hover:text-stone-950'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                View on Wall
              </button>
            </div>

            {/* Visualizer Display Panel */}
            <div className="flex-grow flex items-center justify-center w-full min-h-[350px] relative">
              {viewMode === 'frame' ? (
                /* Frame Customizer View */
                <motion.div 
                  layout
                  className="flex flex-col items-center justify-center"
                >
                  {/* Dynamic Art Frame Container */}
                  <div className={`relative transition-all duration-300 bg-white select-none ${
                    frameStyle === 'canvas' 
                      ? `border-2 p-0 frame-shadow-canvas ${theme === 'funky' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(6,182,212,0.45)]' : 'border-stone-200'}`
                      : frameStyle === 'oak' 
                        ? `border-[16px] border-[#D7C4A5] p-8 frame-shadow-oak ${theme === 'funky' ? 'bg-[#150c2c] border-[#cfb588] shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                        : frameStyle === 'black'
                          ? `border-[16px] border-[#1E1C1A] p-8 frame-shadow-black ${theme === 'funky' ? 'bg-[#150c2c] border-purple-900 shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                          : `border-[16px] border-[#D4AF37] p-8 frame-shadow-gold ring-1 ring-yellow-605/30 ${theme === 'funky' ? 'bg-[#150c2c] border-[#cf9c27] shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                  }`}>
                    {/* Simulated glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                    
                    {/* Simulated bevel cut for frames that have mat board */}
                    {frameStyle !== 'canvas' && (
                      <div className="absolute inset-0 border border-stone-300/40 pointer-events-none m-4" />
                    )}

                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[360px] object-contain transition-all duration-300 shadow-xs"
                    />
                  </div>
                </motion.div>
              ) : (
                /* Interactive Wall Simulation View */
                <div className={`relative w-full h-[380px] rounded-lg overflow-hidden border shadow-inner flex flex-col justify-between items-center p-6 transition-all duration-500 ${
                  wallColor === 'charcoal' ? 'bg-[#1E1E1E] border-stone-950 text-stone-100 shadow-[inset_0_4px_25px_rgba(0,0,0,0.7)]' :
                  wallColor === 'linens' ? 'bg-[#ECEAE4] border-stone-300 text-stone-805 shadow-[inset_0_4px_15px_rgba(0,0,0,0.12)]' :
                  wallColor === 'sage' ? 'bg-[#6E7A6E] border-stone-800 text-stone-100 shadow-[inset_0_4px_20px_rgba(0,0,0,0.25)]' :
                  wallColor === 'burgundy' ? 'bg-[#4C2A2F] border-stone-950 text-stone-100 shadow-[inset_0_4px_25px_rgba(0,0,0,0.5)]' :
                  'trippy-lava border-purple-955 text-purple-100 shadow-[inset_0_4px_25px_rgba(0,0,0,0.8)]'
                }`}>
                  {/* Spotlight projection */}
                  <div className={`absolute inset-0 pointer-events-none opacity-100 ${
                    theme === 'funky' ? 'bg-[radial-gradient(circle_at_50%_15%,rgba(236,72,153,0.25)_0%,rgba(6,182,212,0.05)_50%,rgba(0,0,0,0)_80%)]' : 'wall-spotlight'
                  }`} />
                  
                  {/* Ceiling/Wall joint line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-black/10 border-b border-white/5" />
                  
                  {/* Ceiling Spotlight source indicator */}
                  <div className="absolute -top-1 w-10 h-3 bg-stone-900 border border-white/10 rounded-b-full flex items-center justify-center shadow-md">
                    <div className={`w-4 h-1.5 rounded-full animate-pulse blur-xs ${theme === 'funky' ? 'bg-fuchsia-400 shadow-[0_0_6px_#ff00ff]' : 'bg-amber-200'}`} />
                  </div>

                  {/* Canvas scale dimensions tag */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-wider bg-black/40 text-stone-303 p-1 px-2 rounded-xs pointer-events-none select-none">
                    Scale: {painting.dimensions}
                  </div>

                  {/* Framed Painting on Wall (Scaled relative to couch/console) */}
                  <div className="flex-grow flex items-center justify-center mt-3 z-10">
                    <div className={`relative transition-all duration-300 bg-white select-none scale-[0.6] md:scale-[0.7] transform origin-center ${
                      frameStyle === 'canvas' 
                        ? `border p-0 frame-shadow-canvas ${theme === 'funky' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(6,182,212,0.45)]' : 'border-stone-350'}`
                        : frameStyle === 'oak' 
                          ? `border-[12px] border-[#D7C4A5] p-5 frame-shadow-oak ${theme === 'funky' ? 'bg-[#150c2c] border-[#cfb588] shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                          : frameStyle === 'black'
                            ? `border-[12px] border-[#1E1C1A] p-5 frame-shadow-black ${theme === 'funky' ? 'bg-[#150c2c] border-purple-900 shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                            : `border-[12px] border-[#D4AF37] p-5 frame-shadow-gold ring-1 ring-yellow-605/30 ${theme === 'funky' ? 'bg-[#150c2c] border-[#cf9c27] shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-[#FAF8F5]'}`
                    }`}>
                      <img
                        src={painting.imageUrl}
                        alt={painting.title}
                        referrerPolicy="no-referrer"
                        className="max-h-[220px] object-contain"
                      />
                    </div>
                  </div>

                  {/* Console Table (Wooden or Lucite depending on theme) */}
                  {theme === 'funky' ? (
                    /* Glowing Lucite/Acrylic Console Table */
                    <div className="w-3/5 h-20 border-t border-x border-fuchsia-500 bg-fuchsia-955/15 backdrop-blur-md flex flex-col justify-end relative mt-auto z-10 shadow-[0_-4px_20px_rgba(236,72,153,0.4),inset_0_2px_15px_rgba(236,72,153,0.2)]">
                      {/* Neon pink shadow overlay */}
                      <div className="absolute inset-x-0 -bottom-2 h-2 bg-fuchsia-900/40 blur-xs" />
                      
                      {/* A mock funky/cyberpunk neon decorative vase */}
                      <div className="absolute -top-7 left-12 w-4 h-7 bg-cyan-400/35 rounded-t-full border border-cyan-300/60 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                      <div className="absolute -top-12 left-12 translate-x-1.5 w-0.5 h-6 bg-fuchsia-400 rotate-15 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                      <div className="absolute -top-10 left-12 translate-x-2.5 w-0.5 h-4 bg-cyan-400 -rotate-12 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />

                      <div className="h-0.5 bg-fuchsia-400 w-full opacity-60" />
                      <div className="text-[8px] uppercase tracking-widest font-sans font-bold text-center text-fuchsia-300/80 text-glow-neon select-none pb-2">
                        Lucite Cyber Console (55" Width)
                      </div>
                    </div>
                  ) : (
                    /* Elegant Wooden Console Table */
                    <div className="w-3/5 h-20 border-t-2 border-x border-stone-700/50 bg-[#1E1D1A]/5 backdrop-blur-xs flex flex-col justify-end relative mt-auto z-10">
                      {/* Shadow under console table */}
                      <div className="absolute inset-x-0 -bottom-2 h-2 bg-black/20 blur-xs" />
                      
                      {/* A mock decorative vase and branch */}
                      <div className="absolute -top-7 left-12 w-4 h-7 bg-stone-300/40 rounded-t-full border border-stone-400/20 shadow-xs" />
                      <div className="absolute -top-12 left-12 translate-x-1.5 w-0.5 h-6 bg-emerald-800/40 rotate-15" />
                      <div className="absolute -top-10 left-12 translate-x-2.5 w-0.5 h-4 bg-emerald-800/40 -rotate-12" />

                      <div className="h-1 bg-stone-850/30 w-full" />
                      <div className="text-[8px] uppercase tracking-widest font-sans font-bold text-center text-stone-505/55 select-none pb-2">
                        Studio Console (55" Width)
                      </div>
                    </div>
                  )}

                  {/* Floor border line */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#0F0E0D] border-t border-stone-800" />
                </div>
              )}
            </div>

            {/* Dynamic Controls Bottom Panel */}
            <div className="w-full mt-6 z-10 border-t pt-4 border-stone-200/10 flex flex-col gap-4">
              {viewMode === 'frame' ? (
                /* Frame Customizer Options */
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-stone-400' :
                    theme === 'funky' ? 'text-purple-300' :
                    'text-stone-505'
                  }`}>
                    <Palette className={`w-3.5 h-3.5 ${theme === 'funky' ? 'text-fuchsia-400' : 'text-amber-505'}`} />
                    Configure Museum Framing
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { id: 'canvas', label: 'Canvas Wrap' },
                      { id: 'oak', label: 'Natural Oak' },
                      { id: 'black', label: 'Obsidian Black' },
                      { id: 'gold', label: 'Ornate Gold' }
                    ].map((f) => {
                      const isActive = frameStyle === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setFrameStyle(f.id as any)}
                          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border cursor-pointer transition-all ${
                            isActive
                              ? theme === 'funky'
                                ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                                : 'bg-amber-600 border-amber-600 text-white shadow-md'
                              : theme === 'dark'
                                ? 'bg-stone-900 border-stone-800 text-stone-305 hover:text-stone-100 hover:bg-stone-800' :
                                theme === 'funky'
                                ? 'bg-purple-950/60 border-purple-900 text-purple-300 hover:text-purple-100 hover:bg-purple-900/40'
                                : 'bg-white border-stone-200 text-stone-605 hover:bg-stone-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Wall Visualizer Options */
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-stone-400' :
                    theme === 'funky' ? 'text-purple-300' :
                    'text-stone-505'
                  }`}>
                    <Palette className={`w-3.5 h-3.5 ${theme === 'funky' ? 'text-fuchsia-400' : 'text-amber-505'}`} />
                    Select Wall Paint Color
                  </span>
                  <div className="flex gap-4 justify-center items-center">
                    {[
                      { id: 'charcoal', name: 'Charcoal', bg: 'bg-[#1E1E1E] border-stone-700' },
                      { id: 'linens', name: 'Linen White', bg: 'bg-[#ECEAE4] border-stone-300' },
                      { id: 'sage', name: 'Sage Green', bg: 'bg-[#6E7A6E] border-stone-800' },
                      { id: 'burgundy', name: 'Museum Red', bg: 'bg-[#4C2A2F] border-stone-900' },
                      ...(theme === 'funky' ? [{ id: 'lava', name: 'Trippy Lava', bg: 'trippy-lava border-purple-500' }] : [])
                    ].map((w) => {
                      const isActive = wallColor === w.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => setWallColor(w.id as any)}
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer hover:scale-110 shadow-xs ${w.bg} ${
                            isActive 
                              ? theme === 'funky' 
                                ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-[#0a0418]' 
                                : 'ring-2 ring-amber-555 ring-offset-2 ring-offset-[#0d0c0b]' 
                              : 'ring-0'
                          }`}
                          title={w.name}
                          aria-label={w.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Curatorial Info & Interactive Commission / Inquiry (5 cols) */}
          <div className={`md:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[650px] transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#131211] text-stone-200' :
            theme === 'funky' ? 'bg-[#12072b] text-purple-200 border-l border-purple-900/30' :
            'bg-white text-stone-900'
          }`}>
            <div>
              {/* Category Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[9px] uppercase font-sans font-bold tracking-widest px-2 py-1 rounded-sm border ${
                  theme === 'dark' ? 'bg-stone-900 text-amber-450 border-stone-850' :
                  theme === 'funky' ? 'bg-purple-950/60 text-fuchsia-400 border-purple-800/40 text-glow-neon' :
                  'bg-stone-105 text-amber-800 border-stone-200/50'
                }`}>
                  {painting.category}
                </span>
                <span className="text-stone-500 font-sans">•</span>
                <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider ${theme === 'funky' ? 'text-purple-400' : 'text-stone-400'}`}>
                  Catalog ID: {painting.id}
                </span>
              </div>

              {/* Title & Metadata */}
              <h2 className={`font-serif text-2xl md:text-3xl font-bold tracking-tight leading-tight ${
                theme === 'dark' ? 'text-stone-100' :
                theme === 'funky' ? 'text-cyan-400 text-glow-cyan font-bold' :
                'text-stone-955'
              }`}>
                {painting.title}
              </h2>

              <p className={`font-serif italic text-sm mt-1.5 ${
                theme === 'dark' ? 'text-stone-400' :
                theme === 'funky' ? 'text-purple-300' :
                'text-stone-605'
              }`}>
                {painting.medium}, {painting.year}
              </p>

              <div className={`flex items-center gap-4 mt-4 py-2.5 px-3 border rounded-md ${
                theme === 'dark' ? 'bg-stone-955/40 border-stone-850' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/40 text-purple-300' :
                'bg-stone-50 border-stone-150/60'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                  <span>{painting.dimensions}</span>
                </div>
                <div className={`w-px h-4 ${theme === 'dark' ? 'bg-stone-800' : theme === 'funky' ? 'bg-purple-900/50' : 'bg-stone-200'}`} />
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Acquired in {painting.year}</span>
                </div>
              </div>

              {/* Painting description */}
              <div className="mt-5 space-y-3">
                <h4 className={`text-[10px] uppercase font-sans font-bold tracking-wider flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-stone-500' :
                  theme === 'funky' ? 'text-fuchsia-400' :
                  'text-stone-400'
                }`}>
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  Curatorial Commentary
                </h4>
                <p className={`font-sans text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                  theme === 'dark' ? 'text-stone-300' :
                  theme === 'funky' ? 'text-purple-200/90' :
                  'text-stone-700'
                }`}>
                  {painting.description}
                </p>
              </div>
            </div>

            {/* Bottom Section: Acquisition Panel */}
            <div className={`mt-8 pt-6 border-t ${
              theme === 'dark' ? 'border-stone-850' :
              theme === 'funky' ? 'border-purple-900/30' :
              'border-stone-150'
            }`}>
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-stone-500 font-sans">Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isAvailable 
                      ? theme === 'funky' ? 'bg-cyan-400 shadow-[0_0_8px_#00ffff] animate-pulse' : 'bg-emerald-500 animate-pulse'
                      : 'bg-stone-500'
                  }`} />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">{painting.status}</span>
                </div>
              </div>

              {painting.price !== null ? (
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs text-stone-500 font-sans">Acquisition Price</span>
                  <span className={`font-serif text-2xl font-bold ${
                    theme === 'dark' ? 'text-amber-400' :
                    theme === 'funky' ? 'text-fuchsia-400 text-glow-neon' :
                    'text-stone-955'
                  }`}>
                    ${painting.price.toLocaleString()} USD
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-5 font-sans">
                  <span className="text-xs text-stone-500 font-sans">Acquisition Price</span>
                  <span className="text-stone-500 italic text-xs">NFS (Not For Sale) / Private Collection</span>
                </div>
              )}

              {/* Inquiry Form */}
              <div className={`border p-4 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-stone-955/40 border-stone-850' :
                theme === 'funky' ? 'bg-purple-955/20 border-purple-900/40' :
                'bg-stone-50 border-stone-200/60'
              }`}>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-4"
                  >
                    <CheckCircle2 className={`w-10 h-10 mb-2 ${theme === 'funky' ? 'text-fuchsia-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'text-amber-600'}`} />
                    <h5 className={`font-serif font-semibold text-sm ${theme === 'funky' ? 'text-purple-100' : 'text-stone-100'}`}>Inquiry Sent Successfully</h5>
                    <p className={`font-sans text-xs mt-1 max-w-[280px] ${theme === 'funky' ? 'text-purple-300' : 'text-stone-400'}`}>
                      Your inquiry regarding <strong>{painting.title}</strong> has been cataloged. The studio will contact you promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className={`font-sans font-semibold text-[11px] underline mt-3 cursor-pointer ${theme === 'funky' ? 'text-fuchsia-400 hover:text-fuchsia-300' : 'text-amber-455 hover:text-amber-355'}`}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-3">
                    <h5 className="font-serif font-semibold text-sm flex items-center gap-1.5">
                      <Mail className={`w-4 h-4 ${theme === 'funky' ? 'text-fuchsia-400' : 'text-stone-400'}`} />
                      Inquire About This Work
                    </h5>
                    <p className={`font-sans text-[10px] ${theme === 'funky' ? 'text-purple-300' : 'text-stone-505'}`}>
                      Submit an inquiry to receive custom shipping options, authentication papers, or discuss commission variants.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Name"
                        className={`font-sans text-xs border focus:outline-hidden p-2.5 rounded-sm w-full shadow-2xs ${
                          theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                          theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                          'bg-white border-stone-200 focus:border-amber-700'
                        }`}
                      />
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="Your Email"
                        className={`font-sans text-xs border focus:outline-hidden p-2.5 rounded-sm w-full shadow-2xs ${
                          theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                          theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                          'bg-white border-stone-200 focus:border-amber-700'
                        }`}
                      />
                    </div>

                    <textarea
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder={`I am interested in acquiring/viewing "${painting.title}"...`}
                      rows={3}
                      className={`font-sans text-xs border focus:outline-hidden p-2.5 rounded-sm w-full block shadow-2xs resize-none ${
                        theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                        theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500' :
                        'bg-white border-stone-200 focus:border-amber-700'
                      }`}
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full font-sans text-xs font-bold uppercase tracking-widest py-3 px-4 rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all border-0 ${
                        theme === 'dark' ? 'bg-amber-550 hover:bg-amber-450 text-stone-955' :
                        theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' :
                        'bg-stone-900 hover:bg-amber-900 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <span>Transmitting inquiry...</span>
                      ) : (
                        <>
                          <span>Transmit Studio Inquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
