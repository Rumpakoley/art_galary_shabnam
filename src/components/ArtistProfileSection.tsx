/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, MotionValue } from 'motion/react';
import { ArtistProfile } from '../types';
import ScrollRevealText from './ScrollRevealText';
import ScrollPinnedText from './ScrollPinnedText';

interface ArtistProfileSectionProps {
  profile: ArtistProfile;
  theme?: 'light' | 'dark' | 'funky';
  scrollYProgress?: MotionValue<number>;
}

export default function ArtistProfileSection({
  profile,
  theme = 'light',
  scrollYProgress
}: ArtistProfileSectionProps) {
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

        {/* Right Column: Statement (9 cols on lg) */}
        <div className="lg:col-span-9 w-full">
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
            <div className={`font-serif italic text-xs md:text-sm leading-relaxed text-justify ${
              theme === 'dark' ? 'text-stone-300' :
              theme === 'funky' ? 'text-purple-200/80' :
              'text-black'
            }`}>
              {scrollYProgress ? (
                <ScrollPinnedText text={profile.statement} scrollYProgress={scrollYProgress} />
              ) : (
                <ScrollRevealText text={profile.statement} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
