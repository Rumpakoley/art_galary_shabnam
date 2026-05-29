/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArtistProfile, Painting } from '../types';
import { Mail, Instagram, FileText, Lock, Sparkles, AlertCircle } from 'lucide-react';

interface ArtistProfileSectionProps {
  profile: ArtistProfile;
  paintings: Painting[];
  onOpenPostModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export default function ArtistProfileSection({
  profile,
  paintings,
  onOpenPostModal,
  isAdmin,
  onToggleAdmin
}: ArtistProfileSectionProps) {
  // Compute some real, fun analytics
  const totalWorks = paintings.length;
  const availableWorks = paintings.filter(p => p.status === 'Available').length;
  const soldWorks = paintings.filter(p => p.status === 'Sold').length;
  const reservedWorks = paintings.filter(p => p.status === 'Reserved').length;
  
  // Calculate total worth of available artwork
  const availableValue = paintings
    .filter(p => p.status === 'Available' && p.price !== null)
    .reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div id="artist-profile-panel" className="bg-stone-50 border border-stone-200/60 p-6 md:p-8 rounded-xl h-fit shadow-xs space-y-8 lg:sticky lg:top-8">
      {/* Bio / Portrait section */}
      <div className="flex flex-col items-center text-center">
        {/* Sketch Portrait frame representing luxury framing */}
        <div className="relative group p-2 bg-white border border-stone-200/80 shadow-md rounded-md overflow-hidden aspect-square w-36 h-36 md:w-44 md:h-44 mb-5 transition-transform duration-500 hover:scale-[1.02]">
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.06)]" />
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-[1.02]"
          />
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight leading-none">
          {profile.name}
        </h2>
        <p className="font-serif italic text-stone-500 text-sm mt-1">{profile.title}</p>
        
        <div className="w-12 h-[1px] bg-amber-800/30 my-4" />
        
        <p className="font-sans text-xs md:text-sm text-stone-600 leading-relaxed text-justify">
          {profile.bio}
        </p>
      </div>

      {/* Artist Statement Section */}
      <div className="relative p-5 bg-gold-50 border border-gold-100 rounded-lg shadow-2xs">
        <div className="absolute -top-3 left-4 bg-stone-50 px-2.5 font-serif font-medium italic text-xs text-amber-700 select-none">
          Artist Statement
        </div>
        <p className="font-serif italic text-stone-700 text-xs md:text-sm leading-relaxed text-justify">
          "{profile.statement}"
        </p>
      </div>

      {/* Curatorial Ledger & Statistics */}
      <div className="space-y-3 pt-2">
        <h3 className="font-sans text-[10px] font-bold text-stone-400 tracking-widest uppercase flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Studio Registry Ledger
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-center font-sans text-xs">
          <div className="p-3 bg-white border border-stone-200/40 rounded-md">
            <span className="block font-serif text-xl font-semibold text-stone-900">{totalWorks}</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wide">Archived Works</span>
          </div>
          <div className="p-3 bg-white border border-stone-200/40 rounded-md">
            <span className="block font-serif text-xl font-semibold text-amber-800">{availableWorks}</span>
            <span className="text-[10px] text-stone-500 uppercase tracking-wide">Available Canvases</span>
          </div>
          <div className="p-3 bg-white border border-stone-200/40 rounded-md col-span-2 flex items-center justify-between px-4">
            <span className="text-[10px] text-stone-500 uppercase tracking-wide text-left">Private collections</span>
            <span className="font-serif text-base font-semibold text-stone-700">{soldWorks} works</span>
          </div>
        </div>
      </div>

      {/* Admin Panel Gateway */}
      <div className="pt-2">
        {isAdmin ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Artist Studio Active
              </span>
              <button
                onClick={onToggleAdmin}
                className="text-stone-500 hover:text-stone-950 font-sans text-[11px] underline cursor-pointer"
              >
                Close Studio
              </button>
            </div>
            
            <button
              onClick={onOpenPostModal}
              className="w-full bg-stone-900 hover:bg-amber-900 text-white font-sans text-xs font-medium tracking-wide uppercase py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>+ Post New Work</span>
            </button>
          </div>
        ) : (
          <div className="bg-stone-100/60 p-4 rounded-lg border border-stone-200/40 text-center space-y-2">
            <p className="font-sans text-[11px] text-stone-500 italic">
              Are you the creator, <strong>Shabnam</strong>? Unlock the studio registry to upload and post new paintings.
            </p>
            <button
              onClick={onToggleAdmin}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-stone-850 hover:text-amber-800 transition-colors bg-white px-3.5 py-1.5 border border-stone-200 rounded-md shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <Lock className="w-3 h-3 text-stone-400" />
              <span>Unlock Artist Studio</span>
            </button>
          </div>
        )}
      </div>

      {/* Contact Deck */}
      <div className="pt-4 border-t border-stone-150">
        <h4 className="font-sans text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-3">
          Collector Contacts
        </h4>
        <div className="space-y-2 font-sans text-xs text-stone-600">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2.5 hover:text-amber-800 transition-colors py-1 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-stone-400" />
            <span>{profile.email}</span>
          </a>
          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 hover:text-amber-800 transition-colors py-1 cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-stone-400" />
            <span>{profile.instagram}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
