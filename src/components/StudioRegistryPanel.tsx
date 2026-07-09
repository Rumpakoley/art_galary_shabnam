/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Mail, Instagram, FileText, Lock, Sparkles } from 'lucide-react';
import { ArtistProfile, Painting } from '../types';

interface StudioRegistryPanelProps {
  profile: ArtistProfile;
  paintings: Painting[];
  onOpenPostModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  theme?: 'light' | 'dark' | 'funky';
}

export default function StudioRegistryPanel({
  profile,
  paintings,
  onOpenPostModal,
  isAdmin,
  onToggleAdmin,
  theme = 'light'
}: StudioRegistryPanelProps): React.JSX.Element {
  const totalWorks = paintings.length;
  const availableWorks = paintings.filter(p => p.status === 'Available').length;
  const soldWorks = paintings.filter(p => p.status === 'Sold').length;

  return (
    <div id="studio-registry-panel" className={`p-6 md:p-8 rounded-2xl border transition-colors duration-300 ${
      theme === 'dark'
        ? 'glass-card text-stone-200 shadow-xl shadow-black/40' :
      theme === 'funky'
        ? 'bg-[#150d2c] border-purple-900/40 text-purple-200 shadow-lg shadow-purple-955/20'
        : 'bg-stone-50 border-stone-200/60 text-stone-900 shadow-xs'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Section: Ledger Stats & Admin Actions (8 cols on md) */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-4">
            <h3 className={`font-sans text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-cyan-400' : 
              theme === 'funky' ? 'text-fuchsia-400' : 
              'text-stone-505'
            }`}>
              <FileText className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-400' : 'text-stone-500'}`} />
              Studio Registry Ledger
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-sans text-xs">
              <div className={`p-3 border rounded-md ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/50 text-stone-900'
              }`}>
                <span className={`block font-serif text-xl font-bold ${
                  theme === 'dark' ? 'text-cyan-400 text-glow-cyan' :
                  theme === 'funky' ? 'text-cyan-400 text-glow-cyan' :
                  'text-stone-900'
                }`}>{totalWorks}</span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider">Archived Works</span>
              </div>
              
              <div className={`p-3 border rounded-md ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/50 text-stone-900'
              }`}>
                <span className={`block font-serif text-xl font-bold ${
                  theme === 'dark' ? 'text-amber-400 text-glow-neon animate-pulse' :
                  theme === 'funky' ? 'text-fuchsia-400 text-glow-neon animate-pulse' :
                  'text-amber-800'
                }`}>{availableWorks}</span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider">Available pieces</span>
              </div>
              
              <div className={`p-3 border rounded-md flex flex-col justify-center ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/50 text-stone-900'
              }`}>
                <span className={`block font-serif text-xl font-bold ${
                  theme === 'dark' ? 'text-stone-300' :
                  theme === 'funky' ? 'text-purple-300' :
                  'text-stone-800'
                }`}>{soldWorks}</span>
                <span className="text-[9px] text-stone-505 uppercase tracking-wider">Private Collections</span>
              </div>
            </div>
          </div>

          {/* Registry Admin controls */}
          {isAdmin && (
            <div className={`pt-4 border-t ${
              theme === 'dark' ? 'border-white/10' :
              theme === 'funky' ? 'border-purple-900/30' :
              'border-stone-200/50'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-sm ${
                    theme === 'dark' ? 'bg-cyan-955/30 border-cyan-900/30 text-cyan-400' :
                    theme === 'funky' ? 'bg-purple-955/30 border-purple-800/40 text-fuchsia-400 text-glow-neon' :
                    'bg-amber-50 border-amber-200 text-amber-805'
                  }`}>
                    <Sparkles className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-500'}`} />
                    Studio Registry Active
                  </span>
                  <button
                    onClick={onToggleAdmin}
                    className={`font-sans text-[11px] underline cursor-pointer font-semibold ${
                      theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' :
                      theme === 'funky' ? 'text-purple-400 hover:text-purple-200' :
                      'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Lock Registry
                  </button>
                </div>
                
                <button
                  onClick={onOpenPostModal}
                  className={`w-full font-sans text-[10px] font-bold tracking-widest uppercase py-3 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0 ${
                    theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-extrabold shadow-cyan-955/40 shadow-lg' :
                    theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' :
                    'bg-stone-900 hover:bg-amber-900 text-white'
                  }`}
                >
                  <span>+ Post New Work</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Collector Contacts (4 cols on md) */}
        <div className={`md:col-span-4 space-y-4 md:border-l md:pl-8 h-full flex flex-col justify-between ${
          theme === 'dark' ? 'border-white/10' :
          theme === 'funky' ? 'border-purple-900/30' :
          'border-stone-200/60'
        }`}>
          <div>
            <h4 className="font-sans text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-3">
              Collector Contacts
            </h4>
            <div className="space-y-3 font-sans text-xs text-stone-500">
              <a
                href={`mailto:${profile.email}`}
                className={`flex items-center gap-2.5 transition-colors py-1 cursor-pointer ${
                  theme === 'dark' ? 'hover:text-cyan-400 text-stone-300' :
                  theme === 'funky' ? 'hover:text-cyan-400 text-purple-300' :
                  'hover:text-amber-800 text-stone-600'
                }`}
              >
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{profile.email}</span>
              </a>
              
              <a
                href={`https://www.instagram.com/${profile.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2.5 transition-colors py-1 cursor-pointer ${
                  theme === 'dark' ? 'hover:text-cyan-400 text-stone-300' :
                  theme === 'funky' ? 'hover:text-cyan-400 text-purple-300' :
                  'hover:text-amber-800 text-stone-600'
                }`}
              >
                <Instagram className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{profile.instagram}</span>
              </a>
            </div>
          </div>
          
          <div className="pt-2 text-[10px] text-stone-400 italic font-serif">
            All inquiries regarding acquisitions and commissions can be directed to the studio registry contacts above.
          </div>
        </div>
      </div>
    </div>
  );
}
