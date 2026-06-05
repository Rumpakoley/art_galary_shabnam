/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Painting } from '../types';
import { Maximize2, Tag } from 'lucide-react';

interface PaintingCardProps {
  key?: string | number;
  painting: Painting;
  onViewDetails: (painting: Painting) => void;
  theme?: 'light' | 'dark' | 'funky';
}

export default function PaintingCard({ painting, onViewDetails, theme = 'dark' }: PaintingCardProps): React.JSX.Element {
  const isAvailable = painting.status === 'Available';
  const isSold = painting.status === 'Sold';
  const isReserved = painting.status === 'Reserved';

  return (
    <motion.div
      id={`painting-card-${painting.id}`}
      layout
      initial={{ opacity: 0, y: 45, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.08 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col p-3 transition-all duration-500 border ${
        theme === 'dark' 
          ? 'glass-card rounded-[1.25rem] text-stone-100 hover:-translate-y-1.5' :
        theme === 'funky'
          ? 'bg-[#150c2c] border-purple-900/40 text-purple-100 hover:border-fuchsia-500/80 hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:-translate-y-1.5 hover:rotate-1 rounded-lg'
          : 'bg-stone-50 border-stone-200/60 text-stone-900 hover:border-stone-300 hover:shadow-md hover:-translate-y-1.5 shadow-2xs rounded-lg'
      }`}
    >
      {/* Decorative Vector Curve in Dark Mode */}
      {theme === 'dark' && (
        <div className="absolute top-2 right-2 w-14 h-14 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/40 fill-none stroke-current stroke-[1.5]">
            <path d="M 10 10 A 80 80 0 0 1 90 90" />
          </svg>
        </div>
      )}

      {/* Matte Frame Container (Passe-Partout Mount or Rounded Borderless preview depending on theme) */}
      <div 
        className={`relative overflow-hidden aspect-3/4 cursor-pointer flex items-center justify-center transition-all duration-350 shadow-inner ${
          theme === 'dark' ? 'p-1.5 bg-black/30 border border-white/5 rounded-xl' :
          theme === 'funky' ? 'holo-mount border-purple-955 shadow-[inset_0_2px_12px_rgba(255,255,255,0.4)] p-5 rounded-sm' :
          'bg-[#FCFAF5] border-stone-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)] p-5 rounded-sm'
        }`}
        onClick={() => onViewDetails(painting)}
      >
        {/* Beveled edge cut of the mat board (only for Light/Funky mounted prints) */}
        {theme !== 'dark' && (
          <div className={`absolute inset-[15px] border pointer-events-none transition-colors duration-300 ${
            theme === 'funky' ? 'border-white/20' : 'border-stone-300/20'
          }`} />
        )}

        <img
          src={painting.imageUrl}
          alt={painting.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
            theme === 'dark' ? 'rounded-[10px]' : 'shadow-sm'
          }`}
        />
        
        {/* Subtle Matte Inner Shadow Overlay */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`p-2 px-3.5 rounded-full shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-xs font-sans text-[9px] font-bold tracking-widest uppercase cursor-pointer ${
              theme === 'funky' ? 'bg-fuchsia-600/90 text-white hover:bg-fuchsia-500' : 
              theme === 'dark' ? 'bg-amber-655/90 text-stone-950 hover:bg-amber-500 font-extrabold' :
              'bg-stone-900/90 text-stone-100'
            }`}
          >
            <Maximize2 className={`w-3 h-3 ${theme === 'funky' ? 'text-cyan-200' : theme === 'dark' ? 'text-stone-955' : 'text-amber-400'}`} />
            <span>Exhibition Room</span>
          </motion.div>
        </div>

        {/* Status Badge */}
        <span 
          id={`painting-status-${painting.id}`}
          className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-sans font-bold uppercase tracking-wider rounded-md shadow-xs border ${
            isAvailable 
              ? theme === 'funky'
                ? 'bg-cyan-950/90 text-cyan-400 border-cyan-800/40 text-glow-cyan'
                : theme === 'dark'
                  ? 'bg-amber-950/80 text-amber-400 border-amber-900/30'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200' 
              : isReserved
                ? theme === 'funky'
                  ? 'bg-fuchsia-950/90 text-fuchsia-400 border-fuchsia-800/40 text-glow-neon'
                  : theme === 'dark'
                    ? 'bg-amber-950/80 text-amber-400 border-amber-900/30'
                    : 'bg-amber-100 text-amber-800 border-amber-200' 
                : theme === 'funky'
                  ? 'bg-purple-950/60 text-purple-400 border-purple-900/30 line-through'
                  : theme === 'dark'
                    ? 'bg-stone-800/90 text-stone-400 border-stone-700/35 line-through'
                    : 'bg-stone-200 text-stone-600 border-stone-300 line-through'
          }`}
        >
          {painting.status}
        </span>

        {/* Year Badge */}
        <span className={`absolute bottom-2.5 right-2.5 px-1.5 py-0.5 text-[8px] font-sans font-bold tracking-widest backdrop-blur-xs rounded-xs ${
          theme === 'funky' ? 'bg-purple-955/80 text-fuchsia-300' : 
          theme === 'dark' ? 'bg-black/60 text-amber-450 border border-amber-500/20' :
          'bg-stone-950/70 text-stone-200'
        }`}>
          {painting.year}
        </span>
      </div>

      {/* Frame Artwork Information Plaque */}
      {theme === 'dark' ? (
        <div className="mt-3.5 flex flex-col flex-grow text-[11px] tracking-wide text-stone-400 space-y-1 font-sans px-1">
          <h3 
            className="font-serif text-sm font-bold uppercase tracking-wider text-stone-100 hover:text-amber-400 transition-colors cursor-pointer leading-tight mb-1"
            onClick={() => onViewDetails(painting)}
          >
            {painting.title}
          </h3>
          <div><span className="opacity-50 font-medium">Medium:</span> <span className="text-stone-300 font-medium">{painting.medium}</span></div>
          <div><span className="opacity-50 font-medium">Dimensions:</span> <span className="text-stone-300 font-medium">{painting.dimensions}</span></div>
          {painting.price !== null && (
            <div className="text-amber-400 font-bold font-serif text-xs mt-1">
              ${painting.price.toLocaleString()}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2">
            <h3 
              className={`font-serif text-base font-semibold transition-colors cursor-pointer leading-snug ${
                theme === 'funky' ? 'text-purple-100 hover:text-cyan-400 text-glow-cyan font-bold animate-pulse' : 
                'text-stone-900 hover:text-amber-855'
              }`}
              onClick={() => onViewDetails(painting)}
            >
              {painting.title}
            </h3>
            {painting.price !== null && (
              <span className={`font-serif font-semibold whitespace-nowrap text-base ${
                theme === 'funky' ? 'text-fuchsia-400 text-glow-neon font-bold' : 
                'text-stone-705'
              }`}>
                ${painting.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <p className={`font-sans text-[11px] italic mt-1 ${
            theme === 'funky' ? 'text-purple-405' : 
            'text-stone-500'
          }`}>
            {painting.medium} • {painting.dimensions}
          </p>

          <p className={`font-sans text-xs mt-2.5 line-clamp-2 leading-relaxed flex-grow ${
            theme === 'funky' ? 'text-purple-200/80' : 
            'text-stone-605'
          }`}>
            {painting.description}
          </p>

          {isAvailable && (
            <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
              theme === 'funky' ? 'border-purple-900/30' : 
              'border-stone-150/50'
            }`}>
              <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${
                theme === 'funky' ? 'bg-fuchsia-955/40 text-fuchsia-400 border border-fuchsia-900/30 text-glow-neon' : 
                'bg-emerald-50 text-emerald-800'
              }`}>
                <Tag className="w-3.5 h-3.5" />
                Available Original
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
