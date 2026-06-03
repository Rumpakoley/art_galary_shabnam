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
  theme?: 'light' | 'dark';
}

export default function PaintingCard({ painting, onViewDetails, theme = 'dark' }: PaintingCardProps): React.JSX.Element {
  const isAvailable = painting.status === 'Available';
  const isSold = painting.status === 'Sold';
  const isReserved = painting.status === 'Reserved';

  return (
    <motion.div
      id={`painting-card-${painting.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#131211] border-stone-850 text-stone-100 hover:border-amber-900/40 shadow-xs' 
          : 'bg-stone-50 border-stone-200/60 text-stone-900 hover:border-stone-300 shadow-2xs'
      }`}
    >
      {/* Matte Frame Container (Passe-Partout Mount Simulation) */}
      <div 
        className={`relative overflow-hidden aspect-3/4 rounded-sm cursor-pointer flex items-center justify-center border transition-all duration-350 p-5 shadow-inner ${
          theme === 'dark'
            ? 'bg-[#EFECE6] border-stone-950/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]'
            : 'bg-[#FCFAF5] border-stone-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]'
        }`}
        onClick={() => onViewDetails(painting)}
      >
        {/* Beveled edge cut of the mat board */}
        <div className={`absolute inset-[15px] border pointer-events-none transition-colors duration-300 ${
          theme === 'dark' ? 'border-stone-400/20' : 'border-stone-300/20'
        }`} />

        <img
          src={painting.imageUrl}
          alt={painting.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover shadow-sm transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        
        {/* Subtle Matte Inner Shadow Overlay */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-stone-900/90 text-stone-100 p-2.5 px-4 rounded-full shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-xs font-sans text-[10px] font-bold tracking-widest uppercase cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Exhibition Room</span>
          </motion.div>
        </div>

        {/* Status Badge */}
        <span 
          id={`painting-status-${painting.id}`}
          className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-sans font-bold uppercase tracking-wider rounded-full shadow-xs border ${
            isAvailable 
              ? 'bg-emerald-950/90 text-emerald-450 border-emerald-900/30' 
              : isReserved
                ? 'bg-amber-950/90 text-amber-450 border-amber-900/30' 
                : 'bg-stone-800/90 text-stone-400 border-stone-700/35 line-through'
          }`}
        >
          {painting.status}
        </span>

        {/* Year Badge */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[9px] font-sans font-bold tracking-widest bg-stone-950/70 text-stone-200 backdrop-blur-xs rounded-xs">
          {painting.year}
        </span>
      </div>

      {/* Frame Artwork Information Plaque */}
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className={`font-serif text-base font-semibold transition-colors cursor-pointer leading-snug ${
              theme === 'dark' ? 'text-stone-100 hover:text-amber-400' : 'text-stone-900 hover:text-amber-800'
            }`}
            onClick={() => onViewDetails(painting)}
          >
            {painting.title}
          </h3>
          {painting.price !== null && (
            <span className={`font-serif font-semibold whitespace-nowrap text-base ${
              theme === 'dark' ? 'text-amber-400' : 'text-stone-700'
            }`}>
              ${painting.price.toLocaleString()}
            </span>
          )}
        </div>
        
        <p className={`font-sans text-[11px] italic mt-1 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
          {painting.medium} • {painting.dimensions}
        </p>

        <p className={`font-sans text-xs mt-2.5 line-clamp-2 leading-relaxed flex-grow ${
          theme === 'dark' ? 'text-stone-300/90' : 'text-stone-605'
        }`}>
          {painting.description}
        </p>

        {isAvailable && (
          <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
            theme === 'dark' ? 'border-stone-850' : 'border-stone-150/50'
          }`}>
            <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${
              theme === 'dark' ? 'bg-emerald-950/30 text-emerald-450' : 'bg-emerald-50 text-emerald-800'
            }`}>
              <Tag className="w-3 h-3" />
              Available Original
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
