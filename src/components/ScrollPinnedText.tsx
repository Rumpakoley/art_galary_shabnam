/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface ScrollPinnedTextProps {
  text: string;
  scrollYProgress: MotionValue<number>;
  className?: string;
}

interface WordProps {
  word: string;
  wordIndex: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
}

function Word({ word, wordIndex, totalWords, scrollYProgress }: WordProps): React.JSX.Element {
  // Stagger words from 5% to 95% of scroll progress
  const startProgress = 0.05 + (wordIndex / totalWords) * 0.85;
  const endProgress = startProgress + 0.06; // overlap fade duration
  
  const clampedStart = Math.min(Math.max(startProgress, 0), 0.99);
  const clampedEnd = Math.min(Math.max(endProgress, clampedStart + 0.01), 1.0);

  const opacity = useTransform(
    scrollYProgress,
    [clampedStart, clampedEnd],
    [0.1, 1.0]
  );

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block animate-none"
    >
      {word}
    </motion.span>
  );
}

export default function ScrollPinnedText({ text, scrollYProgress, className = '' }: ScrollPinnedTextProps): React.JSX.Element | null {
  if (typeof text !== 'string' || !text.trim()) {
    return null;
  }

  const tokens = text.split(/(\s+)/).filter(Boolean);
  
  // Count words to calculate stagger steps
  const wordTokens = tokens.filter(token => !/^\s+$/.test(token));
  const totalWords = wordTokens.length;

  let wordIndex = 0;

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token)) {
          if (token.includes('\n')) {
            return <br key={index} />;
          }
          return <span key={index}>&nbsp;</span>;
        }

        const currentWordIndex = wordIndex;
        wordIndex++;

        return (
          <Word
            key={index}
            word={token}
            wordIndex={currentWordIndex}
            totalWords={totalWords}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </span>
  );
}
