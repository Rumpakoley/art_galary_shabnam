/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, MotionValue } from 'motion/react';
import { ArtistProfile, Painting } from '../types';
import { Mail, Instagram, FileText, Lock, Sparkles, AlertCircle } from 'lucide-react';
import ScrollRevealText from './ScrollRevealText';
import ScrollPinnedText from './ScrollPinnedText';

interface ArtistProfileSectionProps {
  profile: ArtistProfile;
  paintings: Painting[];
  onOpenPostModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  theme?: 'light' | 'dark' | 'funky';
  scrollYProgress?: MotionValue<number>;
}

export default function ArtistProfileSection({
  profile,
  paintings,
  onOpenPostModal,
  isAdmin,
  onToggleAdmin,
  theme = 'dark',
  scrollYProgress
}: ArtistProfileSectionProps) {
  // Compute some real, fun analytics
  const totalWorks = paintings.length;
  const availableWorks = paintings.filter(p => p.status === 'Available').length;
  const soldWorks = paintings.filter(p => p.status === 'Sold').length;
  
  return (
    <div id="artist-profile-panel" className={`p-6 md:p-8 rounded-2xl h-fit border transition-colors duration-300 ${
      theme === 'dark'
        ? 'glass-card text-stone-200 shadow-xl shadow-black/40' :
      theme === 'funky'
        ? 'bg-[#150d2c] border-purple-900/40 text-purple-200 shadow-lg shadow-purple-955/20'
        : 'bg-stone-50 border-stone-200/60 text-stone-900 shadow-xs'
    }`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Portrait (3 cols on lg) */}
        <div className="lg:col-span-3 flex justify-center lg:justify-start">
          {/* Sketch Portrait frame representing luxury framing */}
          <div className={`relative group p-1.5 border shadow-md rounded-xl overflow-hidden aspect-square w-36 h-36 md:w-44 md:h-44 shrink-0 transition-transform duration-500 hover:scale-[1.02] ${
            theme === 'dark' ? 'bg-black/20 border-white/10 shadow-lg' :
            theme === 'funky' ? 'bg-[#0a0418] border-purple-800 shadow-[0_0_15px_rgba(236,72,153,0.2)]' :
            'bg-white border-stone-200/80'
          }`}>
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.06)]" />
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover filter contrast-[1.02] ${theme === 'dark' ? 'rounded-lg' : ''}`}
            />
          </div>
        </div>

        {/* Right Column: Statement, stats, registry gateway, and contacts (9 cols on lg) */}
        <div className="lg:col-span-9 space-y-6 w-full">
          {/* Artist Statement Section */}
          <div className={`relative p-5 border rounded-lg shadow-2xs transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#0f111e]/40 border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]' :
            theme === 'funky' ? 'bg-purple-955/30 border-purple-900/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]' :
            'bg-gold-50 border-gold-101'
          }`}>
            <div className={`absolute -top-3 left-4 px-2.5 font-serif font-medium italic text-[11px] select-none transition-colors ${
              theme === 'dark' ? 'bg-[#0b0d19] text-cyan-400 text-glow-cyan font-semibold' :
              theme === 'funky' ? 'bg-[#150d2c] text-fuchsia-400 text-glow-neon font-semibold' :
              'bg-stone-50 text-amber-700'
            }`}>
              Artist Statement
            </div>
            <p className={`font-serif italic text-xs md:text-sm leading-relaxed text-justify ${
              theme === 'dark' ? 'text-stone-300' :
              theme === 'funky' ? 'text-purple-200/80' :
              'text-black'
            }`}>
              {scrollYProgress ? (
                <ScrollPinnedText text={profile.statement} scrollYProgress={scrollYProgress} />
              ) : (
                <ScrollRevealText text={profile.statement} />
              )}
            </p>
          </div>

          {/* Ledger stats block */}
          <div className="space-y-4">
            <h3 className={`font-sans text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-400' : 'opacity-60'}`}>
              <FileText className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-400' : ''}`} />
              Studio Registry Ledger
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-center font-sans text-xs">
              <div className={`p-3 border rounded-md ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/40'
              }`}>
                <span className={`block font-serif text-lg font-bold ${
                  theme === 'dark' ? 'text-cyan-400 text-glow-cyan' :
                  theme === 'funky' ? 'text-cyan-400 text-glow-cyan' :
                  'text-stone-900'
                }`}>{totalWorks}</span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider">Archived</span>
              </div>
              <div className={`p-3 border rounded-md ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/40'
              }`}>
                <span className={`block font-serif text-lg font-bold ${
                  theme === 'dark' ? 'text-amber-400 text-glow-neon animate-pulse' :
                  theme === 'funky' ? 'text-fuchsia-400 text-glow-neon animate-pulse' :
                  'text-amber-800'
                }`}>{availableWorks}</span>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider">Available</span>
              </div>
              <div className={`p-3 border rounded-md col-span-2 flex items-center justify-between px-4 ${
                theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
                'bg-white border-stone-200/40'
              }`}>
                <span className="text-[9px] text-stone-505 uppercase tracking-wider text-left">Private collections</span>
                <span className={`font-serif text-xs font-semibold ${
                  theme === 'dark' ? 'text-stone-300' :
                  theme === 'funky' ? 'text-purple-300' :
                  'text-stone-707'
                }`}>{soldWorks} works</span>
              </div>
            </div>

            {/* Registry Admin controls */}
            <div className="pt-2">
              {isAdmin ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-sm ${
                      theme === 'dark' ? 'bg-cyan-950/30 border-cyan-900/30 text-cyan-400' :
                      theme === 'funky' ? 'bg-purple-950/30 border-purple-800/40 text-fuchsia-400 text-glow-neon' :
                      'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      <Sparkles className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-500'}`} />
                      Studio Registry Active
                    </span>
                    <button
                      onClick={onToggleAdmin}
                      className={`font-sans text-[11px] underline cursor-pointer ${
                        theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' :
                        theme === 'funky' ? 'text-purple-400 hover:text-purple-200' :
                        'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      Lock
                    </button>
                  </div>
                  
                  <button
                    onClick={onOpenPostModal}
                    className={`w-full font-sans text-[10px] font-bold tracking-widest uppercase py-3 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0 ${
                      theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-extrabold shadow-cyan-950/40 shadow-lg' :
                      theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]' :
                      'bg-stone-900 hover:bg-amber-900 text-white'
                    }`}
                  >
                    <span>+ Post New Work</span>
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-lg border text-center space-y-2.5 ${
                  theme === 'dark' ? 'bg-black/20 border-white/5' :
                  theme === 'funky' ? 'bg-purple-955/20 border-purple-900/40 text-purple-300' :
                  'bg-stone-100/60 border-stone-200/40'
                }`}>
                  <p className="font-sans text-[10px] text-stone-500 italic leading-relaxed">
                    Are you the creator, <strong>{profile.name}</strong>? Unlock the studio registry to upload and post new paintings.
                  </p>
                  <button
                    onClick={onToggleAdmin}
                    className={`inline-flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 border rounded-md shadow-2xs transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-stone-900 border-white/10 text-cyan-400 hover:text-cyan-205 hover:bg-stone-850' :
                      theme === 'funky'
                        ? 'bg-[#150d2c] border-purple-850 text-purple-200 hover:text-fuchsia-400 hover:bg-purple-955/60 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                        : 'bg-white border-stone-200 text-stone-850 hover:text-amber-805 hover:bg-stone-50'
                    }`}
                  >
                    <Lock className={`w-3 h-3 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-550'}`} />
                    <span>Unlock Artist Studio</span>
                  </button>
                </div>
              )}
            </div>

            {/* Collector Contacts */}
            <div className={`pt-4 border-t ${
              theme === 'dark' ? 'border-white/10' :
              theme === 'funky' ? 'border-purple-900/30' :
              'border-stone-150'
            }`}>
              <h4 className="font-sans text-[9px] font-bold text-stone-400 tracking-widest uppercase mb-3">
                Collector Contacts
              </h4>
              <div className="space-y-2 font-sans text-xs text-stone-400">
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
                  href={`https://instagram.com`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
