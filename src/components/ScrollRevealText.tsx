/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = '' }: ScrollRevealTextProps): React.JSX.Element {
  const containerRef = useRef<HTMLSpanElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.5"]
  });

  const tokens = text.split(/(\s+)/).filter(Boolean);
  const wordsCount = tokens.filter(t => !/^\s+$/.test(t)).length;
  let wordIndex = 0;

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          if (token.includes('\n')) {
            return <br key={i} />;
          }
          return <span key={i} className="inline">&nbsp;</span>;
        }

        const start = wordIndex / Math.max(wordsCount, 1);
        const end = (wordIndex + 1.8) / Math.max(wordsCount, 1);
        wordIndex++;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, Math.min(end, 1)]}>
            {token}
          </Word>
        );
      })}
    </span>
  );
}

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative inline-block select-none">
      {/* Ghost background word for the scroll-reveal style */}
      <span className="absolute opacity-15" aria-hidden="true">
        {children}
      </span>
      <motion.span style={{ opacity }} className="relative z-10">
        {children}
      </motion.span>
    </span>
  );
}
