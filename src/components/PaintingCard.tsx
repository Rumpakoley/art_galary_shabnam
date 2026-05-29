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
}

export default function PaintingCard({ painting, onViewDetails }: PaintingCardProps): React.JSX.Element {
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
      className="group relative flex flex-col bg-stone-50 border border-stone-200/60 p-4 transition-all duration-300 hover:shadow-lg hover:border-stone-300 hover:-translate-y-0.5 rounded-lg"
    >
      {/* Matte Frame Container */}
      <div 
        className="relative overflow-hidden bg-stone-100 aspect-3/4 rounded-md cursor-pointer flex items-center justify-center border border-stone-200/50"
        onClick={() => onViewDetails(painting)}
      >
        <img
          src={painting.imageUrl}
          alt={painting.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Subtle Matte Inner Shadow Overlay */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)]" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="bg-white/90 text-stone-900 p-3 rounded-full shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-xs font-sans text-xs font-medium tracking-wide uppercase"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View Canvas</span>
          </motion.div>
        </div>

        {/* Status Badge */}
        <span 
          id={`painting-status-${painting.id}`}
          className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full shadow-xs border ${
            isAvailable 
              ? 'bg-amber-50/95 text-amber-800 border-amber-200/50' 
              : isReserved
                ? 'bg-amber-150/95 text-amber-700 border-amber-200/50' 
                : 'bg-stone-200/90 text-stone-600 border-stone-300/50 line-through'
          }`}
        >
          {painting.status}
        </span>

        {/* Year Badge */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-sans font-medium bg-black/40 text-stone-100 backdrop-blur-xs rounded-sm">
          {painting.year}
        </span>
      </div>

      {/* Frame Artwork Information Plaque */}
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="font-serif text-lg text-stone-900 font-medium group-hover:text-amber-800 transition-colors cursor-pointer leading-snug"
            onClick={() => onViewDetails(painting)}
          >
            {painting.title}
          </h3>
          {painting.price !== null && (
            <span className="font-serif text-stone-600 font-medium whitespace-nowrap text-base">
              ${painting.price.toLocaleString()}
            </span>
          )}
        </div>
        
        <p className="font-sans text-xs text-stone-500 italic mt-1 line-clamp-1">
          {painting.medium} • {painting.dimensions}
        </p>

        <p className="font-sans text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed flex-grow">
          {painting.description}
        </p>

        {isAvailable && (
          <div className="mt-4 pt-3 border-t border-stone-150/50 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 font-sans text-[11px] font-medium tracking-wide text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded-sm">
              <Tag className="w-3 h-3 text-amber-700" />
              Available for Purchase
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
