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
  theme?: 'light' | 'dark';
}

export default function ArtistProfileSection({
  profile,
  paintings,
  onOpenPostModal,
  isAdmin,
  onToggleAdmin,
  theme = 'dark'
}: ArtistProfileSectionProps) {
  // Compute some real, fun analytics
  const totalWorks = paintings.length;
  const availableWorks = paintings.filter(p => p.status === 'Available').length;
  const soldWorks = paintings.filter(p => p.status === 'Sold').length;
  
  return (
    <div id="artist-profile-panel" className={`p-6 md:p-8 rounded-xl h-fit border transition-colors duration-300 lg:sticky lg:top-8 ${
      theme === 'dark'
        ? 'bg-[#121110] border-stone-850/80 text-stone-200 shadow-md shadow-black/30'
        : 'bg-stone-50 border-stone-200/60 text-stone-900 shadow-xs'
    }`}>
      {/* Bio / Portrait section */}
      <div className="flex flex-col items-center text-center">
        {/* Sketch Portrait frame representing luxury framing */}
        <div className={`relative group p-2 border shadow-md rounded-md overflow-hidden aspect-square w-36 h-36 md:w-44 md:h-44 mb-5 transition-transform duration-500 hover:scale-[1.02] ${
          theme === 'dark' ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200/80'
        }`}>
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.06)]" />
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-[1.02]"
          />
        </div>

        <h2 className={`font-serif text-2xl md:text-3xl font-bold tracking-tight leading-none ${
          theme === 'dark' ? 'text-stone-100' : 'text-stone-900'
        }`}>
          {profile.name}
        </h2>
        <p className={`font-serif italic text-xs sm:text-sm mt-1.5 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{profile.title}</p>
        
        <div className={`w-12 h-[1px] my-4 ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-800/30'}`} />
        
        <p className={`font-sans text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line ${
          theme === 'dark' ? 'text-stone-300' : 'text-stone-605'
        }`}>
          {profile.bio}
        </p>
      </div>

      {/* Artist Statement Section */}
      <div className={`relative p-5 border rounded-lg shadow-2xs transition-colors duration-300 mt-6 ${
        theme === 'dark' ? 'bg-stone-950/40 border-stone-850' : 'bg-gold-50 border-gold-101'
      }`}>
        <div className={`absolute -top-3 left-4 px-2.5 font-serif font-medium italic text-[11px] select-none transition-colors ${
          theme === 'dark' ? 'bg-[#121110] text-amber-450' : 'bg-stone-50 text-amber-700'
        }`}>
          Artist Statement
        </div>
        <p className={`font-serif italic text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line ${
          theme === 'dark' ? 'text-stone-300' : 'text-stone-705'
        }`}>
          {profile.statement}
        </p>
      </div>

      {/* Curatorial Ledger & Statistics */}
      <div className="space-y-3 pt-4">
        <h3 className="font-sans text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 opacity-60">
          <FileText className="w-3.5 h-3.5" />
          Studio Registry Ledger
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-center font-sans text-xs">
          <div className={`p-3 border rounded-md ${
            theme === 'dark' ? 'bg-stone-950/30 border-stone-850' : 'bg-white border-stone-200/40'
          }`}>
            <span className={`block font-serif text-lg font-bold ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{totalWorks}</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider">Archived</span>
          </div>
          <div className={`p-3 border rounded-md ${
            theme === 'dark' ? 'bg-stone-950/30 border-stone-850' : 'bg-white border-stone-200/40'
          }`}>
            <span className={`block font-serif text-lg font-bold ${theme === 'dark' ? 'text-amber-400 animate-pulse' : 'text-amber-800'}`}>{availableWorks}</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider">Available</span>
          </div>
          <div className={`p-3 border rounded-md col-span-2 flex items-center justify-between px-4 ${
            theme === 'dark' ? 'bg-stone-950/30 border-stone-850' : 'bg-white border-stone-200/40'
          }`}>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider text-left">Private collections</span>
            <span className={`font-serif text-xs font-semibold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>{soldWorks} works</span>
          </div>
        </div>
      </div>

      {/* Admin Panel Gateway */}
      <div className="pt-2">
        {isAdmin ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-sm ${
                theme === 'dark' ? 'bg-amber-950/30 border-amber-900/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Studio Registry Active
              </span>
              <button
                onClick={onToggleAdmin}
                className="text-stone-500 hover:text-stone-300 font-sans text-[11px] underline cursor-pointer"
              >
                Lock
              </button>
            </div>
            
            <button
              onClick={onOpenPostModal}
              className={`w-full font-sans text-[10px] font-bold tracking-widest uppercase py-3 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-black/40' : 'bg-stone-900 hover:bg-amber-900 text-white'
              }`}
            >
              <span>+ Post New Work</span>
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-lg border text-center space-y-2.5 ${
            theme === 'dark' ? 'bg-stone-950/30 border-stone-850' : 'bg-stone-100/60 border-stone-200/40'
          }`}>
            <p className="font-sans text-[10px] text-stone-500 italic leading-relaxed">
              Are you the creator, <strong>Shabnam</strong>? Unlock the studio registry to upload and post new paintings.
            </p>
            <button
              onClick={onToggleAdmin}
              className={`inline-flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 border rounded-md shadow-2xs transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-stone-100 hover:border-stone-750' 
                  : 'bg-white border-stone-200 text-stone-850 hover:text-amber-805 hover:bg-stone-50'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Unlock Artist Studio</span>
            </button>
          </div>
        )}
      </div>

      {/* Contact Deck */}
      <div className={`pt-4 border-t ${theme === 'dark' ? 'border-stone-850' : 'border-stone-150'}`}>
        <h4 className="font-sans text-[9px] font-bold text-stone-400 tracking-widest uppercase mb-3">
          Collector Contacts
        </h4>
        <div className="space-y-2 font-sans text-xs text-stone-400">
          <a
            href={`mailto:${profile.email}`}
            className={`flex items-center gap-2.5 transition-colors py-1 cursor-pointer ${
              theme === 'dark' ? 'hover:text-amber-400 text-stone-300' : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            <Mail className="w-4 h-4 text-stone-400 shrink-0" />
            <span>{profile.email}</span>
          </a>
          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2.5 transition-colors py-1 cursor-pointer ${
              theme === 'dark' ? 'hover:text-amber-400 text-stone-300' : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            <Instagram className="w-4 h-4 text-stone-400 shrink-0" />
            <span>{profile.instagram}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
